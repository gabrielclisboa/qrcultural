import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Monumento } from '../../interaces/monumento.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonumentoService {
  httpClient = inject(HttpClient)
  private apiUrl = 'https://qrculturalapi.azurewebsites.net/api/Monumentos';

  createMonumento(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}`, formData);
  }
  updateMonumento(formData: FormData): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}`, formData);
  }

  getMonumento(id: number): Observable<Monumento> {
    return this.httpClient.get<Monumento>(`${this.apiUrl}/${id}`);
  }

  removeMonumento(id :number): Observable<any> {
    return this.httpClient.delete<Monumento>(`${this.apiUrl}/${id}`);
  }
  
}
