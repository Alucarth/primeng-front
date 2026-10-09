import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@/auth/services/loading.service';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    @if (loadingService.loading$()) {
      <div class="overlay">
        <div class="loader"></div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .loader-19 {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: inline-block;
        border-top: 4px solid #3384f5ff;
        border-right: 4px solid transparent;
        animation: rotation 1s linear infinite;
        position: relative;
      }

      .loader-19::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border-left: 4px solid #003874ff;
        border-bottom: 4px solid transparent;
        animation: rotation 0.5s linear infinite reverse;
      }

      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loader {
        transform: rotateZ(45deg);
        perspective: 1000px;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        color: #141414;
      }
      .loader:before,
      .loader:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: inherit;
        height: inherit;
        border-radius: 50%;
        transform: rotateX(70deg);
        animation: 1s spin linear infinite;
      }
      .loader:after {
        color: #e82e2e;
        transform: rotateY(70deg);
        animation-delay: 0.4s;
      }

      @keyframes rotate {
        0% {
          transform: translate(-50%, -50%) rotateZ(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotateZ(360deg);
        }
      }

      @keyframes rotateccw {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(-360deg);
        }
      }

      @keyframes spin {
        0%,
        100% {
          box-shadow: 0.2em 0px 0 0px currentcolor;
        }
        12% {
          box-shadow: 0.2em 0.2em 0 0 currentcolor;
        }
        25% {
          box-shadow: 0 0.2em 0 0px currentcolor;
        }
        37% {
          box-shadow: -0.2em 0.2em 0 0 currentcolor;
        }
        50% {
          box-shadow: -0.2em 0 0 0 currentcolor;
        }
        62% {
          box-shadow: -0.2em -0.2em 0 0 currentcolor;
        }
        75% {
          box-shadow: 0px -0.2em 0 0 currentcolor;
        }
        87% {
          box-shadow: 0.2em -0.2em 0 0 currentcolor;
        }
      }
    `,
  ],
})
export class LoadingComponent {
  public loadingService = inject(LoadingService);
}
