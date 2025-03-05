import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, ErrorResponseFirebase, userData } from '../Models/customType';
import { User } from '../Models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http : HttpClient = inject(HttpClient);
  router : Router = inject(Router);

  private apiKeyFirebase : string = "";
  private urlReg : string = "";
  private urlLog : string = "";

  
  // emette istanza utente se loggato | null 
  userBehavior : BehaviorSubject<User | null > = new BehaviorSubject<User | null >(null);

  // timer autologout
  private timer : ReturnType<typeof setTimeout> | null = null;

  registrazione( data : userData ) : Observable<AuthResponse>{
    return this.http.post<AuthResponse>( this.urlReg , data )
    .pipe( catchError(  this.errorHandler ), tap( this.userHandler.bind(this) ))
  }
  
  login(  data : userData ) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.urlLog , data )
    .pipe( catchError( this.errorHandler ), tap( this.userHandler.bind(this) ))
  }


  // autologin refresh pagina
  autoLogin(){

    // lettura user da local storage
    const objUser = JSON.parse( localStorage.getItem("user")!); 

    if( objUser != null ){ 

      const user : User = new User(objUser.id, objUser.email, objUser.token, objUser.scadenzaToken );
      
      // token valido 
      if( user.getToken() ){  

        // emissione istanza  
        this.userBehavior.next(user); 

        // azzera timer logout ( precedente da login )
        if( this.timer ){  clearTimeout(this.timer); }

        // timer logout ( data token scaduto - data attuale = ms a scadenza )
        let scadenza =  user.getScadenzaToken() - new Date().getTime();
        this.autoLogout( scadenza )
      }
    }
    else { return }
  }

  logOut(){

    // emissione null - eliminazione da ls  
    this.userBehavior.next(null);   
    localStorage.removeItem("user");   

    // Azzera timer logout - riassegna null
    if( this.timer ){  clearTimeout(this.timer); }
    this.timer = null;

    // redirect
    this.router.navigate(["/login"]);
  }

  // autoLogout
  autoLogout( scadenza : number){ 

    // Salva setTimeout in proprietà e chiama logout a scadenza ms
    this.timer = setTimeout( () => { this.logOut(); }, scadenza ); 

  }


  // Gestione errori richieste http ( return errore messaggio custom )
  private errorHandler( error : HttpErrorResponse ){

    let messErrore : string = ""; 
    const errorF : ErrorResponseFirebase = error.error.error;

    switch(errorF.message){ 
      case "EMAIL_EXISTS":      messErrore = "email già esistente";    break;    
      case "EMAIL_NOT_FOUND":   messErrore = "email non trovata";      break;   
      case "INVALID_PASSWORD":  messErrore = "password non valida";    break; 
      case "USER_DISABLED":     messErrore = "account disabilitato ";  break;  
      case "INVALID_LOGIN_CREDENTIALS":   messErrore = "credenziali non valide";    break; 
      case "OPERATION_NOT_ALLOWED":       messErrore = "operazione non consentita"; break;
      case "TOO_MANY_ATTEMPTS_TRY_LATER": messErrore = "Riprova più tardi";         break;
      default: messErrore= "Errore sconosciuto";
    }

    return throwError( () => { return messErrore });
  }  
  
  // Gestione istanza utente 
  private userHandler( res : AuthResponse ){ 

    // data epoch token scaduto
    const scandenza = new Date().getTime() +  res.expiresIn * 1000; 

    // Creazione - salvataggio ls - emissione 
    const user : User = new User(res.localId, res.email, res.idToken, scandenza );
    localStorage.setItem("user", JSON.stringify(user));                               
    this.userBehavior.next(user);   

    // timer logout ms a scadenza 
    this.autoLogout(  res.expiresIn * 1000 )
  }



}
