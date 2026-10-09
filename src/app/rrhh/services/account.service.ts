import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Account, AccountCreate } from '../interfaces/account.interface';

const baseUrl = environment.baseUrl;
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Account[]>(`${baseUrl}/account`);
  }

  getById(accountId: number) {
    return this.http.get<Account>(`${baseUrl}/account/${accountId}`);
  }

  getApkPath() {
    return this.http.get(`${baseUrl}/account/app-path`, {
      responseType: 'blob',
      observe: 'events',
      reportProgress: true,
    });
  }

  create(payload: AccountCreate) {
    return this.http.post<Account>(`${baseUrl}/account`, payload);
  }

  update(accountId: number, payload: AccountCreate) {
    return this.http.patch<Account>(`${baseUrl}/account/${accountId}`, payload);
  }

  updateLogo(accountId: number, payload: AccountCreate) {
    return this.http.patch<Account>(`${baseUrl}/account/update-logo/${accountId}`, payload);
  }

  updateAndroid(accountId: number, payload: AccountCreate) {
    return this.http.patch<Account>(`${baseUrl}/account/update-android/${accountId}`, payload);
  }

  delete(accountId: number) {
    return this.http.delete(`${baseUrl}/account/${accountId}`);
  }
}
