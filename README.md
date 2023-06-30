# Angular - Login

Tomamos como referencia los siguientes repositorios:
* API de autenticación: https://github.com/Obesidad-Lolera/Oauth-API
* API de empanadas: https://github.com/Obesidad-Lolera/Oauth-Validacion-de-Token-Desde-Laravel


### Creamos un proyecto de Angular, y dentro 4 componentes:

```bash
ng generate component components/login-page
ng generate component components/main-page
ng generate component components/header
```

### Configuramos rutas
Creamos rutas para que los componentes respondan a una URL:

```TypeScript
const routes: Routes = [
	{ path: "", component: MainPageComponent},
	{ path: "login", component: LoginPageComponent},
];
```

### Agregamos condicion de redireccion si no se esta loggeado

**Referencias**:
* https://angular.io/guide/router#preventing-unauthorized-access
* https://codecraft.tv/courses/angular/routing/router-guards/

Creamos un Guard de Angular para verificar el estado de autenticaicon


```bash
	ng generate guard guards/autenticacion --implements CanActivate
```

En el guard, verificamos que haya un token y username en el Local Storage del navegador. Si no hay ninguno, redirigimos al login. El archivo `src/guards/autenticacion.guard.ts` debe quedar con el siguiente contenido:

```typescript
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import {inject} from '@angular/core';


export const autenticacionGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem("accessToken") === null ) {
    const router = inject(Router);
    router.navigate(["/login"]);
    return false;
  }
  return true;
};

```

Una vez creado el Guard, especificamos en la ruta correspondiente su uso, agregando el parametro `canActivate`. En nuestro caso, forzaremos que ver la pagina de inicio requiera estar loggeado:

```typescript
const routes: Routes = [
  { path: "", component: MainPageComponent, canActivate: [autenticacionGuard]},
  { path: "login", component: LoginPageComponent},
];
```
### Servicios

#### Status Service

Creamos un servicio el cual manejará el status de la sesion:
```bash
ng generate service services/status
```

El servicio `src/app/services/status.service.ts` simplemente contiene una variable booleana para especificar si se esta loggeado o no para ser accedido por otros componentes, ademas de hacer esa verificacion en su constructor, por si se refresca la pagina.

```typescript
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() {
    if(localStorage.getItem("accessToken") === null)
      this.isLoggedIn = false;
    else 
      this.isLoggedIn = true;
   }

  public isLoggedIn: boolean = false;
}

```



#### Auth Service
Creamos el servicio para acceder a la API de autenticacion:

```bash
ng generate service services/auth
```

El archivo `src/services/auth.service.ts` debe quedar con el siguiente contenido, el cual define los metodos para obtener un token y para cerrar sesion:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = "http://localhost:8000/oauth/token";
  private logoutUrl = "http://localhost:8000/v1/logout";

  constructor(private http: HttpClient) { }
  

  sendLogin(credentials: any){
    const body = {
      grant_type: "password",
      client_id: "1",
      client_secret: "sLlRFyItNUXGE9m6Ziv8radhRcdpdBWNEJx13A4d",
      username: credentials.email,
      password: credentials.password
    }

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(this.loginUrl, body, httpOptions);
  }

  sendLogout(){
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + localStorage.getItem("accessToken") 
      })
    };

    return this.http.get(this.loginUrl, httpOptions);
  }
  
}
```

#### Empanadas Service

Este servicio es el encargado de obtener las empanadas de la API correspondiente, enviando un access token obtenido desde la API de autenticacion:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class EmpanadasService {

  private apiUrl = "http://localhost:8001/api/v1/empanada";

  constructor(private http: HttpClient) { }
  


  getEmpanadas(){
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + localStorage.getItem("accessToken") 
      })
    };

    return this.http.get(this.apiUrl, httpOptions);
  }
  
}

```

### Componentes

#### Main Page Component

Simplemente renderiza una lista de elementos de la API, como ya vimos en el curso.

#### Login Component

Este componente toma las credenciales de un formulario de login, se las pasa al servicio de la API de autenticacion, y en caso de obtener una respuesta HTTP 200, almacena el Token obtenido en el Local Storage del navegador, y redirige a la pagina principal, ademas de registrar en el servicio de Status que el usuario esta loggeado.

Archivo de componente (`src/app/components/login-page.component.ts`):

```typescript
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  
  public loginError: boolean = false;
  public loginStatus: boolean = false;
  
  constructor(private api: AuthService, private router: Router, private status: StatusService) {}
  


  sendLogin(credentials: any){

    return this.api.sendLogin(credentials).subscribe( 
      (resultado:any) => {
        localStorage.setItem('accessToken', JSON.stringify(resultado["access_token"]));
        this.status.isLoggedIn = true;
        this.router.navigateByUrl('/');

      },

      (error) => {
        this.loginError = true;

      }

    );
  }
}

```

Archivo de template (`src/app/components/login-page.component.html`):

```html
<h3>Login</h3>

<form #dataForm="ngForm" (ngSubmit)="sendLogin(dataForm.value)">

    Correo electrónico <input ngModel  name="email"> <br>
    Contraseña <input type=password ngModel  name="password"> <br>
    
    <button>Login</button>
</form>

<b *ngIf="loginError" > Credenciales invalidas </b>

```


#### Header Component

Este componente es simplemente un menu de navegacion. Tiene una lista de paginas para acceder mediante rutas (inicio, login y logout), y de acuerdo a si el usuario inició sesion o no, muestra la opcion de Login o Logout.  

Tambien implementa la funcionalidad de Logout. 

Archivo de componente (`src/app/components/header.component.ts`):

```typescript
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private api: AuthService, private router: Router, public status: StatusService) {}
  public loggedIn: boolean=false;

  logout(){
    this.api.sendLogout().subscribe();
    localStorage.removeItem("accessToken");
    this.status.isLoggedIn = false;
    this.router.navigateByUrl("/login")
    
  }
}
```

Archivo de template (`src/app/components/header.component.html`):

```html
<h1>EmpanadApp!!!!</h1>

<ul>
  <li>
    <a routerLink="/">Inicio</a>
  </li>
  <li *ngIf="!status.isLoggedIn">
    <a routerLink="/login">Login</a>
  </li>
 
  <li *ngIf="status.isLoggedIn">
    <a routerLink="/#" (click)="logout()">Cerrar Sesión</a>
  </li>
</ul>
```

### Prueba
Ejecutamos `ng serve`, y boilá!!!!!
