import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = 'http://localhost:8091/api/authentication';
  private readonly TOKEN_KEY = 'authToken';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signUp(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, user).pipe(
      tap(
        response => console.log('Signup response:', response), // Debugging: Log response
        error => console.error('Signup error:', error) // Debugging: Log error
      )
    );
  }

  signIn(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, user)
      .pipe(
        tap(response => this.storeToken(response.accessToken))
      );
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/refresh-token?token=${token}`, {})
      .pipe(
        tap(response => this.storeToken(response.accessToken))
      );
  }

  generatePasswordResetToken(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password?email=${email}`, {});
  }

  updatePassword(token: string, newPassword: string): Observable<any> {
    const body = { newPassword }; // You can use shorthand property names
    console.log('Token:', token);
    console.log('New Password:', newPassword);

    return this.http.post<any>(`${this.baseUrl}/reset-password/new`, body, {
      params: { token },
      responseType: 'json' // Ensure the response type is JSON
    }).pipe(
      catchError((error) => {
        // Handle errors here
        console.error('Error updating password:', error);
        // Return an observable with a user-facing error message
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.removeToken();
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, null, { params: { email } });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password/new`, newPassword, { params: { token } });
  }
}
