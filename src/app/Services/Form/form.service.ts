import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from 'src/app/Model/Form/form'; // Update import statement
import { Comments } from 'src/app/Model/Comment/comments';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private baseUrl = 'http://localhost:8091/api/forms';

  constructor(private http: HttpClient) { }

  createBlankForm(adminId: number): Observable<Form> {
    return this.http.post<Form>(`${this.baseUrl}/createBlankForm?adminId=${adminId}`, {});
  }
  getAllForms(): Observable<Form[]> {
    return this.http.get<Form[]>(`${this.baseUrl}/getAllForms`);
  }

  getFormById(id: number): Observable<Form> {
    return this.http.get<Form>(`${this.baseUrl}/getFormById/${id}`);
  }


  likeForm(formId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${formId}/like/${userId}`, {});
  }

  dislikeForm(formId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${formId}/dislike/${userId}`, {});
  }

  addComment(formId: number, commentDto: any, userId: number): Observable<Comments> {
    return this.http.post<Comments>(`${this.baseUrl}/addComment/${formId}/comments?userId=${userId}`, commentDto);
  }

  getComments(formId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.baseUrl}/getComments/${formId}/comments`);
  }

  getFormByIds(ids: number[]): Observable<Form[]> {
    const idsParam = ids.join(',');
    return this.http.get<Form[]>(`${this.baseUrl}/getFormsByIds?ids=${idsParam}`);
  }

}
