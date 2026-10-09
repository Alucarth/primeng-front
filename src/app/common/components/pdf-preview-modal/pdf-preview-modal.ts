import { Component, inject, input, output, signal, effect, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'pdf-preview-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './pdf-preview-modal.html',
  styleUrl: './pdf-preview-modal.css',
})
export class PdfPreviewModal {
  open = input<boolean>(false);
  file = input<File | null>(null);
  fileName = input<string>('');
  downloadable = input<boolean>(false);

  isOpen = signal(false);
  pdfUrl = signal<SafeResourceUrl | null>(null);

  @Output() openChange = new EventEmitter<boolean>();

  private sanitizer = inject(DomSanitizer);
  private _objectUrl: string | null = null;

  constructor() {
    effect(() => {
      this.isOpen.set(this.open());
    });

    effect(() => {
      if (this.isOpen() !== this.open()) {
        this.openChange.emit(this.isOpen());
      }
    });

    effect(() => {
      if (this.isOpen() && this.file()) {
        if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
        this._objectUrl = URL.createObjectURL(this.file()!);
        this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this._objectUrl));
      } else {
        if (this._objectUrl) {
          URL.revokeObjectURL(this._objectUrl);
          this._objectUrl = null;
        }
        this.pdfUrl.set(null);
      }
    });
  }

  download(): void {
    if (!this._objectUrl || !this.file()) return;
    const link = document.createElement('a');
    link.href = this._objectUrl;
    link.download = this.fileName() || 'documento.pdf';
    link.click();
  }
}
