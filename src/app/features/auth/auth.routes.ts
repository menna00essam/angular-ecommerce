import { Routes } from '@angular/router';
import { LoginGuard } from '../../core/guards/login.guard';


export const AUTH_ROUTES: Routes = [
  {
    path: '', 
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login),
     canActivate: [LoginGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.Register),
     canActivate: [LoginGuard]
  }
];