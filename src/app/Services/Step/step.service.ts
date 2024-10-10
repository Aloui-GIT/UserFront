import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Step } from 'src/app/Model/Step/step';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  private baseUrl = 'http://localhost:8091/api/steps'; // Replace with your Spring Boot backend URL

  constructor(private http: HttpClient) { }



  // Method to get steps of a specific form
  getStepsByFormId(formId: number): Observable<Step[]> {
    return this.http.get<Step[]>(`${this.baseUrl}/getStepsByFormId/${formId}`);
  }

  getStepCount(formId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/${formId}`);
  }



}
