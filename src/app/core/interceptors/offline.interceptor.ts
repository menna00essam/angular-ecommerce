import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OfflineService } from '../services/offline.service';

export function offlineInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const offlineService = inject(OfflineService);

  if (!offlineService.isOnline && req.method === 'GET') {
    const cached = localStorage.getItem(`offline_${req.url}`);
    if (cached) {
      return of(new HttpResponse({ status: 200, body: JSON.parse(cached) }));
    }
    return throwError(() => new Error('No offline data available.'));
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 0 && req.method === 'GET') {
        const cached = localStorage.getItem(`offline_${req.url}`);
        if (cached) {
          return of(new HttpResponse({ status: 200, body: JSON.parse(cached) }));
        }
      }
      return throwError(() => error);
    })
  );
}
