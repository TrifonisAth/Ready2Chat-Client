import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/animations';
import { RegisterCredential } from 'src/app/interfaces/RegisterCredential';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeInOutAnimation],
})
export class RegisterComponent {
  private animationState: string = 'fadeInOut';

  registrationForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(40),
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z0-9_]*$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z0-9!$@&]*$'),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {
    this.authService.registrationStatus.subscribe({
      next: (status) => {
        if (status) {
          this.registrationForm.reset();
          this.router.navigate(['/email-verification']);
        }
      },
    });
  }

  onSubmit() {
    const credential: RegisterCredential = {
      ...(this.registrationForm.value as RegisterCredential),
    };
    this.authService.register(credential);
  }

  getAnimationState() {
    return this.animationState;
  }
}
