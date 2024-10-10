import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Answer } from 'src/app/Model/Answer/answer';
import { AnswerDto } from 'src/app/Model/DTO/AnswerDto';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private apiUrl = 'http://localhost:8091/api/answers'; // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  // Get all answers
  getAllAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.apiUrl);
  }

  // Get answer by ID
  getAnswerById(id: number): Observable<Answer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Answer>(url);
  }

  // Create a new answer
  createAnswers(answers: Answer[]): Observable<Answer[]> {
    return this.http.post<Answer[]>(`${this.apiUrl}/createAnswers`, answers);
  }

  // Update an existing answer
  updateAnswer(id: number, answer: Answer): Observable<Answer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Answer>(url, answer);
  }

  // Delete an answer by ID
  deleteAnswer(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  submitAnswers(answers: AnswerDto[]): Observable<string> {
    const url = `${this.apiUrl}/submitAnswers`;
    return this.http.post<string>(url, answers);
  }

  // Assign an option to an answer
  assignOptionToAnswer(answerId: number, optionId: number): Observable<string> {
    const url = `${this.apiUrl}/${answerId}/assign-option/${optionId}`;
    return this.http.put<string>(url, {});
  }

  updateAnswersWithOptions(answers: AnswerDto[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateAnswerWithOptions`, answers);
  }

  getAnswersBySubmissionId(submissionId: number): Observable<any> {
    return this.http.get(`/api/answers/submission/${submissionId}`);
  }

}
