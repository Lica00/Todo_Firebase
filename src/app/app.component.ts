import { Component, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IconsComponent } from "./components/icons/icons.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, IconsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'To do';

  auth : AuthService = inject(AuthService);
  renderer : Renderer2 = inject(Renderer2);
  router : Router = inject(Router);
  darkMode : WritableSignal<boolean> = signal(true);

  ngOnInit(){ 
    // Verifica istanza user salvata in ls ( refresh app )
    this.auth.autoLogin(); 

    // Recuperà mode da ls - se non presente imposta light
    let mode = localStorage.getItem('darkMode');
    this.darkMode.set( mode === "true" );
    this.applyMode( this.darkMode() );
  }

  logOut(){ this.auth.logOut(); }

  // Gestisce light - dark su elemento <html> 
  changeMode(){ 

    // Inverte il valore attuale
    const newMode = !this.darkMode();

    // Applica immediatamente il nuovo tema
    this.renderer.setAttribute(document.documentElement, 'class', newMode ? "dark" : "light");

    // salva in ls e signal
    this.saveMode(newMode);
  }

  // Applica light - dark ad inizializzione
  applyMode( mode : boolean ){
    this.renderer.setAttribute(document.documentElement, 'class', mode ? "dark" : "light");
  }

  saveMode( actual : boolean ){ 
    localStorage.setItem('darkMode', `${actual}`); 
    this.darkMode.set(actual); 
  }

}
