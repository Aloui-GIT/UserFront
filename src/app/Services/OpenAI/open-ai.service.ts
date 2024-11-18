import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Form } from 'src/app/Model/Form/form';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'http://localhost:8091/api/openai/suggestions';  // Adjust the URL to match your backend

  constructor(private http: HttpClient) { }

  // Method to fetch suggestions from backend with openai
  getSuggestions(title: string, description: string, questionId: number, userInput: string): Observable<string[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { title, description, questionId, userInput };
console.log('this is service ', body)
    // Make HTTP POST request to fetch suggestions
    return this.http.post<string[]>(this.apiUrl, body, { headers });
  }

  getSuggestionsCohere(title: string, description: string, questionId: number, userInput: string): Observable<string[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { title, description, questionId, userInput };

    console.log('Request body:', body);

    // Make HTTP POST request to fetch suggestions
    return this.http.post<{ suggestions: string[] }>(`${this.apiUrl}/cohere`, body, { headers })
      .pipe(
        map((response: { suggestions: string[] }) => response.suggestions)  // Use the map operator
      );
  }


}
