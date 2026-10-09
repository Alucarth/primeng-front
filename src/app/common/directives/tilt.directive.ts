import { Directive, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Directive({
  selector: '[appTilt]',
  standalone: true, // 👈 si usas Angular standalone
})
export class TiltDirective implements AfterViewInit, OnDestroy {
  @Input() tiltMax = 15;
  @Input() tiltSpeed = 400;
  @Input() tiltGlare = true;
  @Input() tiltMaxGlare = 0.3;
  @Input() tiltScale = 1.05;

  private tiltInstance: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.tiltInstance = VanillaTilt.init(this.el.nativeElement, {
      max: this.tiltMax,
      speed: this.tiltSpeed,
      glare: this.tiltGlare,
      'max-glare': this.tiltMaxGlare,
      scale: this.tiltScale,
    });
  }

  ngOnDestroy(): void {
    if (this.el?.nativeElement?.vanillaTilt) {
      this.el.nativeElement.vanillaTilt.destroy();
    }
  }
}
