import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { fadeInOutAnimation } from 'src/app/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ForgotPasswordComponent {
  private animationState: string = 'fadeInOut';

  forgotPasswordForm = new FormGroup({
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

  constructor(private fb: FormBuilder) {}

  getAnimationState() {
    return this.animationState;
  }

  onSubmit() {
    console.log(this.forgotPasswordForm.value);
  }
}
