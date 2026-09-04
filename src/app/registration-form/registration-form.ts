import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css'
})
export class RegistrationForm {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    agreeTerms: [false, [Validators.requiredTrue]]
  }, { validators: [passwordMatchValidator] });

  submitted = signal(false);
  registeredUser = signal<{ username: string; email: string } | null>(null);

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  get isPasswordMismatch(): boolean {
    const confirmCtrl = this.form.get('confirmPassword');
    return !!(this.form.hasError('passwordMismatch') && (confirmCtrl?.dirty || confirmCtrl?.touched));
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const val = this.form.getRawValue();
      this.registeredUser.set({
        username: val.username || '',
        email: val.email || ''
      });
      this.submitted.set(true);
    }
  }

  resetForm() {
    this.form.reset({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    });
    this.submitted.set(false);
    this.registeredUser.set(null);
  }
}
