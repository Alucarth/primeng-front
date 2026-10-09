import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = signal<boolean>(false);
  readonly loading$ = computed<boolean>(this._loading);

  private showTimestamp = 0;
  private minVisibleDuration = 1000; // mínimo 1 segundo visible

  show(minDurationMs: number = 1000) {
    this.minVisibleDuration = minDurationMs;
    this.showTimestamp = Date.now();
    // console.log('aqui deberia mostrar')
    this._loading.set(true);
    // console.log(this._loading)
  }

  hide() {
    const elapsed = Date.now() - this.showTimestamp;
    const remaining = this.minVisibleDuration - elapsed;

    if (remaining > 0) {
      setTimeout(() => this._loading.set(false), remaining);
    } else {
      // console.log('aqui termino enterio ')
      this._loading.set(false);
    }
  }
}
