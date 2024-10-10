import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/Services/Register/register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false; // Ensure this is declared
  constructor(
    private fb: FormBuilder,
    private authService: RegisterService,
    private router: Router ,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe(
        (user: any) => {
          sessionStorage.setItem('userId', user.userId); // Store user ID in session storage
          sessionStorage.setItem('role', user.role); // Store user role in session storage
          sessionStorage.setItem('username', user.username); // Store username in session storage
          this.router.navigate(['/']); // Redirect to home or desired route after login
        },
        (error) => {
          this.errorMessage = 'Invalid username or password';
        }
      );
    }
  }
  onForgotPassword(): void {
    const email = prompt('Please enter your email address for password reset:');
    if (email) {
      console.log('Setting isLoading to true');
      this.isLoading = true; // Show loading indicator
      this.authService.requestPasswordReset(email).subscribe(
        (response) => {
          console.log('Password reset link sent:', response);
          this.toastr.success('Password reset link sent to your email.', 'Success');
          console.log('Setting isLoading to false');
          this.isLoading = false; // Hide loading indicator
        },
        (error) => {
          console.error('Error:', error);
          this.toastr.error('An error occurred. Please try again.', 'Error');
          console.log('Setting isLoading to false');
          this.isLoading = false; // Hide loading indicator
        }
      );
    }
  }
}
