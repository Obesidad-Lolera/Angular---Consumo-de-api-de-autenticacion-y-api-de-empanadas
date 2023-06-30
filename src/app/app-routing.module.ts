import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { autenticacionGuard } from './guards/autenticacion.guard';

const routes: Routes = [
  { path: "", component: MainPageComponent, canActivate: [autenticacionGuard]},
  { path: "login", component: LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
