import { Routes } from '@angular/router';
import { taskUserGuard } from './guard/task-user.guard';
import { LoginRegisterComponent } from './components/login-register/login-register.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch : 'full'},
    { path: "login", component: LoginRegisterComponent},
    {  path: "tasks", canActivate: [taskUserGuard], 
        loadComponent : () => import('./components/task/task.component')
        .then( (obj) => { return obj.TaskComponent })
    }
];
