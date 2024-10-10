import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Option } from 'src/app/Model/Option/option'; // Update import statement

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  private baseUrl = 'http://localhost:8091/api/options';  // Replace with your backend base URL

  constructor(private http: HttpClient) { }

  // Method to get Options by Question ID
  getOptionsByQuestionId(questionId: number): Observable<Option[]> {
    return this.http.get<Option[]>(`${this.baseUrl}/getOptionsByQuestionId/${questionId}`);
  }}
