import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class InterceptorService implements HttpInterceptor{

  // Inietti istanza auth service
  auth : AuthService = inject(AuthService);
  
  intercept( request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {

    // Subscribe behaviorSubject service auth
    return this.auth.userBehavior.pipe( 
      take(1),
        exhaustMap( ( user ) => { 

          // Verifica istanza
          if( user ){ 

            // Crea oggetto HttpHeaders con { chiave : valore }
            let header : HttpHeaders = new HttpHeaders( { "Authorization" : `Bearer ${user.getToken()}`} )

            // Clona richiesta intercettata + inserisce header con token 
            let reqCopy = request.clone( { headers : header } );

            // Inoltra richiesta modificata con token --> return observable
            return next.handle(reqCopy);
          }

          // Istanza non valida ( null )  --> return richiesta originale 
          return next.handle(request);
        }
      )
    )

  }

}


