import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import {  task, taskItem } from '../../Models/customType';
import { IconsComponent } from '../icons/icons.component';


@Component({
  selector: 'app-task',
  imports: [ FormsModule, IconsComponent ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  taskS : TasksService = inject(TasksService);
  allTask : WritableSignal<taskItem[]> = signal([]);
  error : WritableSignal<string> = signal("");
  idTaskUpdateMode : WritableSignal<string> = signal("");
  
  ngOnInit(){ this.getAll(); }

  // Chiede tutte le task e salva in array ( signal )
  getAll(){ 
    this.taskS.getAllTask().subscribe( 
      { 
        next : ( dati ) => {  
          for( let key in dati ){
            const obj : taskItem = { id : key, value : dati[key] }
            this.allTask.update( (value) => { return [ ...value, obj ]})
          }},
        error: ( err : string ) => { this.errorHandler(err) }
      } 
    )
  }

  // Inserisce nuova task e aggiorna array ( invece di richiedere tutte le task )
  addTask( form : NgForm ){ 
  
    const descr = form.controls["task"].value.trim();
    const task : task =  { descrizione: descr, completato: false };
    form.reset();
    this.taskS.addTask(task).subscribe( 
      {  
        next : (dati) => {  
          const obj : taskItem = { id : dati.name, value : task }
          this.allTask.update( (value) => { return [ ...value, obj ]})
        },
        error: ( err : string ) => { this.errorHandler(err) }
      }
    )
  }


  // Elimina task e aggiorna array ( invece di richiedere tutte le task )
  deleteTask( id : string ){ 

    this.taskS.deledeTask(id).subscribe( 
      { 
        next : (dati) => {  
        this.allTask.update( (value) => { return value.filter( (v) => { return v.id != id } ) });
        },
        error: ( err : string ) => { this.errorHandler(err) }
      }
    ); 
  }

  
  
  updateDescrTask( task : taskItem ){

    // Se c'è una task già in aggiornamento salvi modifica 
    if( this.idTaskUpdateMode() !== ""){ 
      this.idTaskUpdateMode.set(""); 
      this.taskS.updateTask(task).subscribe( { error: ( err : string ) => { this.errorHandler(err) } } ); 
    }

    // Se non c'è una task in aggiornamento abiliti modifica
    else{ this.idTaskUpdateMode.set(task.id); }
  }

  updateCompTask( task : taskItem ){
    this.taskS.updateTask(task).subscribe( { error: ( err : string ) => { this.errorHandler(err) } }); 
  }

  errorHandler( err : string ){
    this.error.set(err);
    setTimeout( () => {  this.error.set(""); }, 3000 )
  }

 

}
