import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOutAnimation } from 'src/app/animations';
import { LoginCredential } from 'src/app/interfaces/LoginCredential';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInOutAnimation],
})
export class LoginComponent {
  private animationState: string = 'fadeInOut';

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(40),
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z0-9!$@&]*$'),
    ]),
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.loginStatus.subscribe({
      next: (status) => {
        if (status) {
          this.router.navigate(['/dashboard']);
        }
      },
    });
  }

  getAnimationState() {
    return this.animationState;
  }

  onSubmit() {
    const credentials: LoginCredential = {
      ...(this.loginForm.value as LoginCredential),
    };
    this.auth.login(credentials);
  }
}
