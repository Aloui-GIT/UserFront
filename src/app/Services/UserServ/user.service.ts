import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/Model/User/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8091/api/user'; // Update the base URL if necessary

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }
  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/getUser/${userId}`);
  }

  // Update user
  updateUser(userId: number, updatedUser: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.baseUrl}/update/${userId}`, updatedUser, { headers });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend error
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  uploadProfilePicture(userId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file); // Append the file to form data

    return this.http.post(`${this.baseUrl}/uploadProfilePicture/${userId}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * (event.loaded || 0) / (event.total || 1));
            return { status: 'progress', message: progress };
          case HttpEventType.Response:
            return { status: 'complete', message: 'Upload complete!' };
          default:
            return { status: 'unknown', message: event };
        }
      }),
      catchError(error => {
        console.error('Upload failed:', error);
        return throwError('Upload failed. Please try again.');
      })
    );
  }

  // user.service.ts
  getProfilePicture(userId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8091/api/user/profilePicture/${userId}`, {
      responseType: 'blob'
    });
  }
  deleteUserById(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`, { responseType: 'text' });
  }

}
