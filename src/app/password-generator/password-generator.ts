import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-password-generator',
  imports: [],
  templateUrl: './password-generator.html',
  styleUrl: './password-generator.css',
})
export class PasswordGenerator {

  password = signal('');
  generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let pass = '';
    const randomValues = new Uint32Array(12);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < 12; i++) {
      pass += chars[randomValues[i] % chars.length];
    }
    this.password.set(pass);
  }
}
