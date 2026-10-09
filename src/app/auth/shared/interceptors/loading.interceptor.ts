import { LoadingService } from '@/auth/services/loading.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  // console.log('injectando servicio de loading')
  loadingService.show();

  return next(req).pipe(finalize(() => loadingService.hide()));
};
