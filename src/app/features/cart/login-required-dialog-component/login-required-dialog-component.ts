import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-login-required-dialog',
  template: `
    <h2 mat-dialog-title>Login Required</h2>
    <mat-dialog-content>
      <p>You need to log in before proceeding to checkout.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" (click)="goToLogin()">Login</button>
    </mat-dialog-actions>
  `,
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
