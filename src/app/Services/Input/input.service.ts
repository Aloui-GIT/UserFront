import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Input } from 'src/app/Model/Input/input';

@Injectable({
  providedIn: 'root'
})
export class InputService {
  private baseUrl = 'http://localhost:8091/api/inputs';

  constructor(private http: HttpClient) { }



  // Method to get an input by its ID
  getInputById(id: number): Observable<Input> {
    return this.http.get<Input>(`${this.baseUrl}/getInputById/${id}`);
  }
}
