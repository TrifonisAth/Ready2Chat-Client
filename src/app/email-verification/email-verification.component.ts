import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutAnimation } from '../animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
  animations: [fadeInOutAnimation],
})
export class EmailVerificationComponent {
  private animationState: string = 'fadeInOut';
  countdown: number = 30;

  mailVerificationForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      // pattern: 6 digits only, 0-9
      Validators.pattern('^[0-9]{6}$'),
    ]),
  });

  constructor(private auth: AuthService, private router: Router) {
    this.startCountdown();
    this.auth.verificationStatus.subscribe({
      next: (status) => {
        if (status) {
          this.router.navigate(['/dashboard']);
        }
      },
    });
  }

  private startCountdown() {
    this.countdown = 60;
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  isDisabled(): boolean {
    return this.countdown !== 0;
  }

  onSubmit() {
    if (this.mailVerificationForm.valid) {
      const code = this.mailVerificationForm.value.code!;
      this.auth.verifyEmail(code);
    }
  }

  wait() {}

  resendCode() {
    this.auth.resendCode();
    this.startCountdown();
  }

  getAnimationState() {
    return this.animationState;
  }
}
