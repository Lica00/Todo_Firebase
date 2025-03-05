import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { Observable } from 'rxjs';
import { AuthResponse, userData } from '../../Models/customType';
import { Router } from '@angular/router';
import { IconsComponent } from "../icons/icons.component";

@Component({
  selector: 'app-login-register',
  imports: [FormsModule, IconsComponent],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {

  auth : AuthService = inject(AuthService);
  router : Router = inject(Router);

  // Se form usato per login / registrazione
  isLoginMode : boolean = true;

  // Switch modalità form ( login o registrazione ) 
  switchMode(){ this.isLoginMode = !this.isLoginMode; }

  // Se mostrare spinner ( attesa risposta server )
  isLoading : boolean = false; 

  // Salva text error richiesta ( mostra nella view / null per no errore )
  messaggioErrore : string | null = null;

  // Salva obs return richieste login o registrazione ( invece di gestione separata )
  authObservable! : Observable<AuthResponse>;

  // Raccolta dati utente click btn form
  submit( form : NgForm ){
    const mail = form.controls["email"].value;
    const pass = form.controls["password"].value;
    const userData : userData = { email : mail, password : pass, returnSecureToken: true }
    this.isLoading = true;

    if(this.isLoginMode){ this.authObservable = this.auth.login(userData); }
    else{ this.authObservable = this.auth.registrazione(userData); }
    
    this.authObservable.subscribe(
      
      {
        next : ( response ) => { 
        this.isLoading = false;
        this.router.navigate(["/tasks"]);
      }, 
        error: ( error : string ) => {
          this.isLoading = false;
          this.messaggioErrore = error;
          setTimeout( () => { this.messaggioErrore = null; }, 3000 )
        } 
    }
    )

    form.reset();

  }



}
