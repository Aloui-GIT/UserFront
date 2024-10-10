import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubmissionDto } from 'src/app/Model/DTO/SubmissionDto';
import { Answer } from 'src/app/Model/Answer/answer';
import { Submission } from 'src/app/Model/Submission/submission';
import { Form } from 'src/app/Model/Form/form';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  private baseUrl = 'http://localhost:8091/api/submissions'; // Adjust as needed



  constructor(private http: HttpClient) {}

  saveSubmission(submissionDto: SubmissionDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/saveSubmission`, submissionDto).pipe(
      catchError(this.handleError)
    );
  }

    private handleError(error: any): Observable<never> {
    // Handle different types of errors here
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  createSubmission(userId: number, formId: number): Observable<Submission> {
    const url = `${this.baseUrl}/createSubmission`;
    const params = { userId: userId.toString(), formId: formId.toString() };
    return this.http.post<Submission>(url, null, { params });
  }

  getSubmission(userId: number, formId: number): Observable<Submission> {
    return this.http.get<Submission>(`${this.baseUrl}/getSubmission/user/${userId}/form/${formId}`);
  }

  updateSubmission(submissionId: number, submissionDto: SubmissionDto): Observable<Submission> {
    return this.http.put<Submission>(`${this.baseUrl}/updateSubmission/${submissionId}`, submissionDto);
  }

  getSubmissionHistoryByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history/${userId}`);
  }
  getFormsBySubmissionId(submissionId: number): Observable<Form[]> {
    const url = `http://localhost:8091/api/submissions/${submissionId}/forms`;  // Adjust the URL as needed
    return this.http.get<Form[]>(url);
  }

  getSubmissionCount(userId: number, formId: number): Observable<number> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('formId', formId.toString());

    return this.http.get<number>(`${this.baseUrl}/countsubmission`, { params });
  }
}
