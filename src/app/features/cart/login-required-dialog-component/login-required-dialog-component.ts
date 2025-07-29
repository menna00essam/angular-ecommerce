import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-login-required-dialog',
  templateUrl: './login-required-dialog-component.html',
  styleUrls: ['./login-required-dialog-component.css'],
  imports: [MatDialogModule, MatButtonModule]
})
export class LoginRequiredDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginRequiredDialogComponent>,
    private router: Router
  ) {}

  close() {
    this.dialogRef.close();
  }

  goToLogin() {
    this.dialogRef.close();
    this.router.navigate(['/auth/login']);
  }
}
