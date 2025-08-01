// import { Injectable } from '@angular/core';
// import {
//   HttpEvent,
//   HttpInterceptor,
//   HttpHandler,
//   HttpRequest,
//   HttpResponse,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { camelCase, mapKeys } from 'lodash';
//
// @Injectable()
// export class CaseInterceptor implements HttpInterceptor {
//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     console.log("ccccccccccccccccccccccc")
//     return next.handle(req).pipe(
//       map((event: HttpEvent<any>) => {
//         if (event instanceof HttpResponse) {
//           const camelCaseBody = this.convertToCamelCase(event.body);
//           return event.clone({ body: camelCaseBody });
//         }
//         return event;
//       })
//     );
//   }
//
//   private convertToCamelCase(body: any): any {
//     if (!body || typeof body !== 'object') {
//       return body;
//     }
//
//     if (Array.isArray(body)) {
//       return body.map((item) => this.convertToCamelCase(item));
//     }
//
//     return mapKeys(body, (value, key) => camelCase(key));
//   }
// }
