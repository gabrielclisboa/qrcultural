import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CardDto } from '../../interaces/cardDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  httpClient = inject(HttpClient);

  url = "https://qrculturalapi.azurewebsites.net/api/Cards";

  getAllCards() {
    return this.httpClient.get<CardDto[]>(this.url);
  }

  createCard(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(`${this.url}`, formData);
  }

  updateCard(formData: FormData): Observable<any> {
    return this.httpClient.put<any>(`${this.url}`, formData);
  }
}
