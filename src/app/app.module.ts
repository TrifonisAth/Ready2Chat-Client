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

@NgModule({
  declarations: [
    AppComponent,
    AuthFormComponent,
    LoginBasicComponent,
    RegisterBasicComponent,
    HomeComponent,
    WebRtcDemoComponent,
    ChatComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
