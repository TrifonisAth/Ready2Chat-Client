import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { RegisterComponent } from './input/register/register.component';
import { LoginComponent } from './input/login/login.component';
import { ForgotPasswordComponent } from './input/forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { LogoutComponent } from './logout/logout.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { RequestsComponent } from './requests/requests.component';
import { CallComponent } from './call/call.component';

const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  {
    path: 'register',
    component: RegisterComponent,
    data: { animation: 'fadeInOut' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'fadeInOut' },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { animation: 'fadeInOut' },
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
    data: { animation: 'fadeInOut' },
  },
  { path: 'home', component: HomeComponent },
  {
    path: 'logout',
    component: LogoutComponent,
    outlet: 'dashboardOutlet',
  },
  {
    path: 'call',
    component: CallComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { animation: 'fadeInOut' },
    children: [
      { path: '', component: ChatComponent, outlet: 'dashboardOutlet' },
      {
        path: 'friends',
        component: FriendListComponent,
        outlet: 'dashboardOutlet',
        pathMatch: 'full',
      },
      {
        path: 'requests',
        component: RequestsComponent,
        outlet: 'dashboardOutlet',
      },
      {
        path: 'logout',
        component: LogoutComponent,
        outlet: 'dashboardOutlet',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
