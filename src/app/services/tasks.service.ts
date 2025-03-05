import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, exhaustMap, Observable, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { addTaskResponse, allTaskResponse, task, taskItem } from '../Models/customType';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  http : HttpClient = inject(HttpClient);
  auth : AuthService = inject(AuthService);
  url : string = "";

  // Richiesta http get all task 
  getAllTask(): Observable< allTaskResponse >{
    return this.auth.userBehavior.pipe( 
      take(1), exhaustMap( ( user ) => { 
        return this.http.get<allTaskResponse>(`${this.url}/${user!.id}.json`).pipe( catchError( this.errorHandler ))
      }
    ))
  }

  // Richiesta http post inserimento task
  addTask( task : task ): Observable<addTaskResponse>{
    return this.auth.userBehavior.pipe(
      take(1), exhaustMap( ( user ) => { 
        return this.http.post<addTaskResponse>(`${this.url}/${user!.id}.json`, task ).pipe( catchError( this.errorHandler ) )
      }
    ))
  }

  // Richiesta http delete task 
  deledeTask( id : string ): Observable<null>{
    return this.auth.userBehavior.pipe(
      take(1), exhaustMap( ( user ) => { 
        return this.http.delete<null>(`${this.url}/${user!.id}/${id}.json` ).pipe( catchError( this.errorHandler ))
      }
    ))
  }

  // Richiesta http update task ( passi task completE ma patch aggiorna solo nuovo valore )
  updateTask( task : taskItem ): Observable<task>{
    return this.auth.userBehavior.pipe(
      take(1), exhaustMap( ( user ) => { 
        return this.http.patch<task>(`${this.url}/${user!.id}/${task.id}.json`, task.value ).pipe( catchError( this.errorHandler ) )
      }
    ))
  }



  // Gestione errori richieste http ( return errore messaggio custom )
  private errorHandler( error : HttpErrorResponse ){
    let messErrore : string = ""; 
    const errorF : string = error.error.error;

    switch(errorF){ 
      case "UNAUTHORIZED_REQUEST":         messErrore = "Richiesta non autorizzata";  break; 
      case "MISSING_AUTHORIZATION_HEADER": messErrore = "Autorizzazione mancante";    break;    
      case "PERMISSION_DENIED":            messErrore = "Permesso negato";            break;    
      case "TIMEOUT":                      messErrore = "Ha impiegato troppo tempo";  break; 
      case "UNKNOWN_ERROR":                messErrore = "Errore sconosciuto";         break;
      default: messErrore= "Errore sconosciuto";
    }
    return throwError( () => { return messErrore });
  }  

}

