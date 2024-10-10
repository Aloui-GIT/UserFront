import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Input } from 'src/app/Model/Input/input';
import { Question } from 'src/app/Model/Question/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:8091/api/questions';

  constructor(private http: HttpClient) {
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/getAllQuestions`);
  }

  getQuestionsByStepId(stepId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/getQuestionsByStepId/${stepId}`);
  }

  getInputIdForQuestion(questionId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${questionId}`);
  }

  getInputByQuestionId(questionId: number): Observable<Input> {
    return this.http.get<Input>(`${this.baseUrl}/getInputByQuestionId/${questionId}`);
  }

  isQuestionRequired(idQuestion: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${idQuestion}/required`);
  }
}
