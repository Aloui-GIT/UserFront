import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { NavbarComponent } from './Components/Shared/navbar/navbar.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsListComponent } from './forms-list/forms-list.component';
import { FormDetailComponent } from './form-detail/form-detail.component';
import { AuthInterceptor } from './Components/Auth/auth.interceptor';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {provideToastr, ToastrModule } from 'ngx-toastr';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './Components/home/home.component';
import { LoadingComponent } from './Components/loading/loading.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PasswordResetComponent } from './Components/password-reset/password-reset.component';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    FormsListComponent,
    FormDetailComponent,
    ThankYouComponent,
    UserSettingsComponent,
    HistoryComponent,
    HomeComponent ,
    LoadingComponent,
    PaginationComponent ,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ToastrModule.forRoot()

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
