import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription, fromEvent } from 'rxjs';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control?: NgControl,
  ) {}

  ngOnInit(): void {
    this.subscription = fromEvent(this.el.nativeElement, 'input').subscribe(
      () => {
        const input = this.el.nativeElement;
        const upper = input.value.toUpperCase();

        if (input.value !== upper) {
          const start = input.selectionStart;
          const end = input.selectionEnd;
          input.value = upper;
          input.setSelectionRange(start, end);

          if (this.control?.control) {
            this.control.control.setValue(upper, { emitEvent: false });
          }
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
