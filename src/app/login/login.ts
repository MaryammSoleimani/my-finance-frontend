import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  mode: string = 'login';

  credentials = {
    username: '',
    password: ''
  };

  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password';
        console.error(err);
      }
    });
  }

  onRegister() {
    this.errorMessage = '';

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register({
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed';
        console.error(err);
      }
    });
  }

  switchMode(mode: string) {
    this.mode = mode;
    this.errorMessage = '';
  }
}
