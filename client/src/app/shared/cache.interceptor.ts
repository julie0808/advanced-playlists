import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpContextToken } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpCacheService } from './http-cache.service';

export const YOUTUBE_PLAYLIST_ID = new HttpContextToken(() => 'PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt');
export const CACHEABLE = new HttpContextToken(() => false);

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // only cache requests configured to be cacheable
    if (!req.context.get(CACHEABLE)) {
      return next.handle(req);
    }

    // pass along non-cacheable requests and invalidate cache
    if (req.method !== 'GET') {
      //console.log(`Invalidating cache: ${req.method} ${req.urlWithParams}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> | undefined = this.cacheService.get(req.urlWithParams);

    // return cached response
    if (cachedResponse) {
      //console.log(`Returning a cached response: ${cachedResponse.url}`);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(req)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            //console.log(`Adding item to cache: ${req.urlWithParams}`);
            this.cacheService.put(req.urlWithParams, event);
          }
        })
      );

  }
}