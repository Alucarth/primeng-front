/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

const baseUrl = environment.baseUrl;
@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);

  uploadVoucherUserTemporal(data: FormData) {
    return this.http.post<any>(`${baseUrl}/upload`, data);
  }

  uploadImage(data: FormData) {
    return this.http.post<any>(`${baseUrl}/upload/image`, data);
  }

  uploadWorkflowForm(data: FormData) {
    return this.http.post<any>(`${baseUrl}/upload/workflow-form`, data);
  }

  downloadFile(relativePath: string): Observable<Blob> {
    const url = `${baseUrl}/upload/get-file/${relativePath}`;
    // Set responseType to 'blob' to receive the file data as a Blob
    return this.http.get(url, { responseType: 'blob' });
  }

  uploadDocumentEmployee(data: FormData, employeeId: number) {
    return this.http.post<any>(`${baseUrl}/upload/employee/document/${employeeId}`, data);
  }

  uploadClientContractDocument(data: FormData, clientContractId: number) {
    return this.http.post<any>(
      `${baseUrl}/upload/client-contract/document/${clientContractId}`,
      data,
    );
  }

  uploadContractEmployee(data: FormData, employeeId: number) {
    return this.http.post<any>(`${baseUrl}/upload/employee/contract/${employeeId}`, data);
  }

  uploadProfileEmployee(data: FormData, employeeId: number) {
    return this.http.post<any>(`${baseUrl}/upload/employee/profile/${employeeId}`, data);
  }

  uploadImageClient(data: FormData, clientId: number) {
    return this.http.post<any>(`${baseUrl}/upload/client/image/${clientId}`, data);
  }

  uploadLogoAccount(data: FormData, accountId: number) {
    return this.http.post<any>(`${baseUrl}/upload/account/logo/${accountId}`, data);
  }

  uploadApkAccount(data: FormData, accountId: number) {
    return this.http.post<any>(`${baseUrl}/upload/account/apk/${accountId}`, data);
  }
}
