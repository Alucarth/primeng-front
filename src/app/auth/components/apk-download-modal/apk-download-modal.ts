import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'apk-download-modal',
  imports: [CommonModule, DialogModule, ProgressBar, ButtonModule],
  templateUrl: './apk-download-modal.html',
  styleUrl: './apk-download-modal.css',
})
export class ApkDownloadModal {
  private messageService = inject(MessageService);

  open = input<boolean>(false);
  download = input<Observable<HttpEvent<Blob>> | null>(null);
  blockedReason = input<string | null>(null);

  @Output() openChange = new EventEmitter<boolean>();

  readonly visible = signal(false);
  readonly blocked = signal<string | null>(null);
  readonly progress = signal(0);
  readonly downloaded = signal(0);
  readonly total = signal(0);
  readonly indeterminate = signal(false);
  readonly status = signal<'downloading' | 'ready' | 'error'>('downloading');
  readonly elapsed = signal(0);
  readonly speed = signal(0);
  readonly averageSpeed = signal(0);

  private subscription?: Subscription;
  private timerId?: ReturnType<typeof setInterval>;
  private startAt = 0;
  private lastSampleAt = 0;
  private lastLoaded = 0;
  private emaSpeed = 0;

  constructor() {
    effect(() => {
      this.visible.set(this.open());
      if (!this.open()) {
        this.subscription?.unsubscribe();
        this.subscription = undefined;
        this.blocked.set(null);
        this.reset();
      }
    });

    effect(() => {
      const reason = this.blockedReason();
      if (this.open()) {
        this.blocked.set(reason);
      }
    });

    effect(() => {
      const download$ = this.download();
      if (this.open() && download$) {
        this.start(download$);
      }
    });
  }

  private start(download$: Observable<HttpEvent<Blob>>): void {
    if (this.blocked()) {
      return;
    }
    this.subscription?.unsubscribe();
    this.reset();
    this.status.set('downloading');
    this.startAt = Date.now();
    this.lastSampleAt = 0;
    this.lastLoaded = 0;
    this.emaSpeed = 0;
    this.timerId = setInterval(() => this.tick(), 1000);

    this.subscription = download$.subscribe({
      next: (event) => {
        if (event.type === HttpEventType.DownloadProgress) {
          this.onProgress(event.loaded, event.total ?? null);
        } else if (event.type === HttpEventType.Response) {
          this.onComplete(event.body as Blob);
        }
      },
      error: () => this.onError(),
    });
  }

  private tick(): void {
    this.elapsed.set(Math.floor((Date.now() - this.startAt) / 1000));
    if (this.lastSampleAt > 0 && Date.now() - this.lastSampleAt > 2000) {
      this.emaSpeed = 0;
      this.speed.set(0);
    }
  }

  private onProgress(loaded: number, total: number | null): void {
    const now = Date.now();
    const dt = (now - this.lastSampleAt) / 1000;
    if (this.lastSampleAt > 0 && dt > 0) {
      const instant = (loaded - this.lastLoaded) / dt;
      if (instant >= 0) {
        this.emaSpeed = this.emaSpeed === 0 ? instant : this.emaSpeed * 0.6 + instant * 0.4;
      }
    }
    this.lastSampleAt = now;
    this.lastLoaded = loaded;
    this.speed.set(this.emaSpeed);
    this.elapsed.set(Math.floor((now - this.startAt) / 1000));

    this.downloaded.set(loaded);
    if (total && total > 0) {
      this.total.set(total);
      this.indeterminate.set(false);
      this.progress.set(Math.round((loaded / total) * 100));
    } else {
      this.indeterminate.set(true);
      this.progress.set(0);
    }
  }

  private onComplete(blob: Blob): void {
    this.clearTimer();
    if (!blob || blob.size === 0) {
      this.onError();
      return;
    }
    this.status.set('ready');
    this.progress.set(100);
    this.indeterminate.set(false);
    const secs = Math.max(1, Math.floor((Date.now() - this.startAt) / 1000));
    this.elapsed.set(secs);
    this.downloaded.set(blob.size);
    this.total.set(blob.size);
    this.averageSpeed.set(blob.size / secs);
    this.saveBlob(blob);
  }

  private onError(): void {
    this.clearTimer();
    this.status.set('error');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo descargar el APK',
    });
  }

  private saveBlob(blob: Blob): void {
    // const url = URL.createObjectURL(
    //   new Blob([blob], { type: 'application/vnd.android.package-archive' }),
    // );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SvApp.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatSpeed(bytesPerSecond: number): string {
    return this.formatFileSize(bytesPerSecond) + '/s';
  }

  formatDuration(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  close(): void {
    this.clearTimer();
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.openChange.emit(false);
  }

  private clearTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private reset(): void {
    this.clearTimer();
    this.progress.set(0);
    this.downloaded.set(0);
    this.total.set(0);
    this.indeterminate.set(false);
    this.status.set('downloading');
    this.elapsed.set(0);
    this.speed.set(0);
    this.averageSpeed.set(0);
    this.startAt = 0;
    this.lastSampleAt = 0;
    this.lastLoaded = 0;
    this.emaSpeed = 0;
  }
}
