import { Admin } from './../../interaces/admin.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly USERNAME_KEY = 'username';
  private readonly PASSWORD_KEY = 'password';
  
  httpClient = inject(HttpClient);
  login: EventEmitter<boolean> = new EventEmitter<boolean>();

  url = "https://qrculturalapi.azurewebsites.net/api/Admin";

  validateLogin(login: Admin) {
    return this.httpClient.post<{ success: boolean }>(this.url + "/Login", login);
  }
  setLogged(username: string, password: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.PASSWORD_KEY, password);
    this.login.emit(true);
  }
  getLogged(): boolean {
    return !!localStorage.getItem(this.USERNAME_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.PASSWORD_KEY);
    this.login.emit(false); 
  }
}
