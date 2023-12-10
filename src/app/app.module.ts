import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthFormComponent } from './forms/auth-form/auth-form.component';
import { LoginBasicComponent } from './input/login-basic/login-basic.component';
import { RegisterBasicComponent } from './input/register-basic/register-basic.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebRtcDemoComponent } from './communication/web-rtc-demo/web-rtc-demo.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './input/auth/auth.component';
import { LoginComponent } from './input/login/login.component';
import { RegisterComponent } from './input/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WindowComponent } from './visuals/window/window.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ForgotPasswordComponent } from './input/forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FriendListComponent } from './friend-list/friend-list.component';
import { LogoutComponent } from './logout/logout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { NotificationComponent } from './notification/notification.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { UserListComponent } from './user-list/user-list.component';
import { RequestsComponent } from './requests/requests.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { CallComponent } from './call/call.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthFormComponent,
    LoginBasicComponent,
    RegisterBasicComponent,
    HomeComponent,
    WebRtcDemoComponent,
    ChatComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    WindowComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    FriendListComponent,
    LogoutComponent,
    PageNotFoundComponent,
    LoaderComponent,
    NotificationComponent,
    EmailVerificationComponent,
    UserListComponent,
    RequestsComponent,
    CustomDatePipe,
    CallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
