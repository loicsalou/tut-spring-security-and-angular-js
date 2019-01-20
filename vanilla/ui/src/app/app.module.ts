import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {AppService} from './app.service';
import {AppComponent} from './app.component';
import {HomeComponent} from './home.component';
import {LoginComponent} from './login.component';
import {UserDetailsComponent} from './user-details/user-details.component';
import {AuthGuardService} from './auth-guard.service';
import {ClearGuardService} from './clear-guard.service';
import {KeyboardEventsComponent} from './keyboard-events/keyboard-events.component';
import {KeyboardEventsDirective} from './keyboard-events.directive';
import {AnonymousGuardService} from './anonymous-guard.service';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
                            headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
                          });
    return next.handle(xhr);
  }
}

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent, canActivate: [ ClearGuardService ]},
  {path: 'login', component: LoginComponent, canActivate: [ ClearGuardService, AnonymousGuardService ]},
  {path: 'userDetails', component: UserDetailsComponent, canActivate: [ AuthGuardService ]},
  {path: 'keyboard', component: KeyboardEventsComponent, canActivate: [ AuthGuardService ]}
];

@NgModule({
            declarations: [
              AppComponent,
              HomeComponent,
              LoginComponent,
              UserDetailsComponent,
              KeyboardEventsComponent,
              KeyboardEventsDirective
            ],
            imports: [
              RouterModule.forRoot(routes),
              BrowserModule,
              HttpClientModule,
              FormsModule
            ],
            providers: [ AppService, {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true} ],
            bootstrap: [ AppComponent ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
          })
export class AppModule {
}
