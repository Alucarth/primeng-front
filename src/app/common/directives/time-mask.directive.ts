import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription, fromEvent } from 'rxjs';

const HH_MM_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

@Directive({
  selector: '[appTimeMask]',
  standalone: true,
})
export class TimeMaskDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control?: NgControl,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      fromEvent(this.el.nativeElement, 'input').subscribe(() => this.applyMask()),
    );
    this.subscriptions.push(
      fromEvent(this.el.nativeElement, 'blur').subscribe(() => this.normalizeOnBlur()),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private applyMask(): void {
    const digits = this.el.nativeElement.value.replace(/\D/g, '').slice(0, 4);
    let result = '';

    if (digits.length === 1) {
      result = digits;
    } else if (digits.length === 2) {
      result = `${digits}:`;
    } else if (digits.length >= 3) {
      result = `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }

    this.setValue(result);
  }

  private normalizeOnBlur(): void {
    const digits = this.el.nativeElement.value.replace(/\D/g, '').slice(0, 4);
    if (!digits) {
      this.setValue('');
      return;
    }

    let result = '';
    if (digits.length === 1 || digits.length === 2) {
      result = `${digits.padStart(2, '0')}:00`;
    } else if (digits.length === 3) {
      result = `${digits.slice(0, 1).padStart(2, '0')}:${digits.slice(1, 3)}`;
    } else {
      result = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }

    this.setValue(HH_MM_PATTERN.test(result) ? result : '');
  }

  private setValue(value: string): void {
    const input = this.el.nativeElement;
    if (input.value !== value) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = value;
      input.setSelectionRange(start, end);
    }

    if (this.control?.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
  }
}
