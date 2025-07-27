import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core'; 

export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

 
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null; 
    }

 
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule 
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit, OnDestroy {
 
  private authService = inject(AuthService);
 
 

 
  registerForm!: FormGroup;

 
  authError = this.authService.authError;
  isLoading = this.authService.isLoading;

 

  constructor() {
 
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: MustMatch('password', 'confirmPassword') }); 
  }

  ngOnInit(): void {
 
  }

  ngOnDestroy(): void {
 
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.register({ username, email, password }).subscribe({
        next: (response) => {
          console.log('Registration successful!', response);
 
        },
        error: (error) => {
          console.error('Registration failed:', error);
 
        }
      });
    } else {
 
      this.registerForm.markAllAsTouched();
    }
  }

  showPassword = false;

toggleShowPassword(): void {
  this.showPassword = !this.showPassword;
}



  get f() {
    return this.registerForm.controls;
  }
}

