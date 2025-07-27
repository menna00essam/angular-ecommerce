import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {TranslateModule } from '@ngx-translate/core'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  private authService = inject(AuthService);

  loginForm!: FormGroup;

  authError = this.authService.authError;
  isLoading = this.authService.isLoading;

  rememberMe: boolean = false;

  constructor() {
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {   
    const storedRememberMe = localStorage.getItem('rememberMe');
    if (storedRememberMe === 'true') {
      this.rememberMe = true;
      const storedUsernameOrEmail = localStorage.getItem('loginUsernameOrEmail');
      if (storedUsernameOrEmail) {
        this.loginForm.get('usernameOrEmail')?.setValue(storedUsernameOrEmail);
      }
    }
  }

showPassword = false;

toggleShowPassword(): void {
  this.showPassword = !this.showPassword;
}


  onRememberMeChange(event: Event): void {
    this.rememberMe = (event.target as HTMLInputElement).checked;
    if (!this.rememberMe) {
      localStorage.removeItem('loginUsernameOrEmail');
    }
  }

  
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { usernameOrEmail, password } = this.loginForm.value;

      if (this.rememberMe) {
        localStorage.setItem('loginUsernameOrEmail', usernameOrEmail);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('loginUsernameOrEmail');
        localStorage.removeItem('rememberMe');
      }

     
      this.authService.login(usernameOrEmail, password, this.rememberMe).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  
  get f() {
    return this.loginForm.controls;
  }
}