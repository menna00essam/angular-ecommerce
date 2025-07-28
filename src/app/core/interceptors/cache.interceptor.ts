import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export function cacheInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  return next(req).pipe(
    tap(event => {
      if (req.method === 'GET' && event instanceof HttpResponse) {
        localStorage.setItem(`offline_${req.url}`, JSON.stringify(event.body));
      }
    })
  );
}
