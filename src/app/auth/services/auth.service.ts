/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import {
  AuthResponse,
  ProfileResponse,
  Role,
  RolesResponse,
} from '../interfaces/auth-response.interface';
import { environment } from '../../enviroments/environment';
import { UploadService } from './upload.service';
import { User } from '../../rrhh/layout/interfaces/user.interface';

const baseUrl = environment.baseUrl;
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private uploadService = inject(UploadService);

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _role = signal<Role | null>(JSON.parse(localStorage.getItem('role') ?? '{}'));
  private _roles = signal<Role[] | null>(JSON.parse(localStorage.getItem('roles') ?? '{}'));
  private _avatarUrl = signal<string | null>(null);
  private _logoUrl = signal<string | null>(null);
  private rolesRefreshed = false;

  // private _theme = signal<String | null>(localStorage.getItem('color-theme'));

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  // checkStatusResource = rxResource({
  //     loader: () => this.checkStatus(),
  // });

  user = computed<User | null>(() => this._user());

  avatarUrl = computed<string | null>(() => this._avatarUrl());
  logoUrl = computed<string | null>(() => this._logoUrl());

  token = computed<string | null>(this._token);

  role = computed<Role | null>(this._role);

  roles = computed<Role[] | null>(this._roles);

  // theme = computed<String | null>(this._theme);
  // roleName = computed<String | null>(this._role().name ?? '');

  login(username: string, password: string): Observable<boolean> {
    console.log(baseUrl);
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        username: username,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.post<AuthResponse>(`${baseUrl}/auth/refresh-token`, {}).pipe(
      map((resp) => {
        // console.log('resp', resp.user.is_secure);

        return this.handleAuthSuccess(resp);
      }),
      tap(() => {
        if (!this.rolesRefreshed) {
          this.rolesRefreshed = true;
          this.getRoles().subscribe();
        }
      }),
      catchError((error: any) => this.handleAuthError(error)),
      shareReplay(1),
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    this._role.set(null);
    this._roles.set(null);
    this.rolesRefreshed = false;

    localStorage.clear();

    // localStorage.clear()
  }

  private handleAuthSuccess({ access_token }: AuthResponse) {
    // this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(access_token);
    // console.log('roles',roles)

    localStorage.setItem('token', access_token);
    console.log('-------->');
    this.http.get<User>(`${baseUrl}/auth/profile`).subscribe((userProfile) => {
      this._user.set(userProfile);
      // if (this._user()?.person?.avatarUrl) {
      //   this.uploadService.downloadFile(this._user()!.person.avatarUrl!).subscribe({
      //     next: (blob: Blob) => {
      //       const url = window.URL.createObjectURL(blob);
      //       this._avatarUrl.set(url);
      //       console.log(this._avatarUrl());
      //     },
      //   });
      // }
      console.log('----> ', this.user());

      // console.log('institution ------>', this._institution());

      // this.http
      //   .get<any>(`${baseUrl}/person-institution/by-person/${this.user()?.id}?page=1&limit=10`)
      //   .subscribe((resp) => {
      //     console.log('++++>>>>', resp);
      //     this.handleInstitutionSuccess(resp.data);
      //   });
      // .pipe(
      //   map((resp) => {
      //     console.log('========>', resp.data);
      //     this.handleInstitutionSuccess(resp.data);
      //     return resp;
      //   }),

      //   catchError((error: any) => this.handleAuthError(error)),
      // );
      // this.getInstitution(this.user()!.id).subscribe((data) => {
      //   console.log('update institution data', data);
      // });
    });

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  getRoles() {
    this.rolesRefreshed = true;

    return this.http.get<RolesResponse>(`${baseUrl}/auth/roles`).pipe(
      map((resp) => {
        // console.log('resp', resp.user.is_secure);
        return this.handleRolesSuccess(resp);
      }),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  getProfile() {
    return this.http.get<ProfileResponse>(`${baseUrl}/auth/profile`).pipe(
      map((resp) => {
        // console.log('resp', resp.user.is_secure);
        return this.handleProfileSuccess(resp);
      }),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/auth/profile`);
  }

  // getInstitution(person_id: number) {
  //   return this.http
  //     .get<any>(`${baseUrl}/person-institution/by-person/${person_id}?page=1&limit=10`)
  //     .pipe(
  //       map((resp) => {
  //         console.log('========>', resp.data);
  //         this.handleInstitutionSuccess(resp.data);
  //         return resp;
  //       }),

  //       catchError((error: any) => this.handleAuthError(error)),
  //     );
  // }

  async getAvatarImage() {
    if (this._user()?.person.imagePath) {
      const blob: Blob = await firstValueFrom(
        this.uploadService.downloadFile(this._user()!.person?.imagePath!),
      );
      return window.URL.createObjectURL(blob);
    } else {
      return null;
    }
  }

  // getInstitutionImage(fileRelativePath: string) {
  //   if (!fileRelativePath) {
  //     // path not found
  //     return;
  //   }
  //   this.uploadService.downloadFile(fileRelativePath).subscribe({
  //     next: (blob: Blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       this.logoUrl.set(url);
  //     },
  //   });
  // }

  // private handleInstitutionSuccess(institutions: AuthInstitution[]) {
  //   if (institutions.length > 0) {
  //     let inStorage = localStorage.getItem('institution');
  //     console.log('institutions', institutions);
  //     console.log('inStorage', inStorage);
  //     if (inStorage) {
  //       const institutionSearch: AuthInstitution = JSON.parse(inStorage);
  //       //update data
  //       const institutionFinded = institutions.find(
  //         (obj) => institutionSearch.id === obj.institutionId,
  //       );
  //       if (institutionFinded) {
  //         localStorage.setItem('institution', JSON.stringify(institutionFinded));
  //         inStorage = localStorage.getItem('institution');
  //       }

  //       const institution: AuthInstitution = JSON.parse(inStorage!);
  //       console.log('institution--->', institution);
  //       if (!institutions.includes(institution)) {
  //         if (institution.id === institutions[0].id) {
  //           this._institution.set(institution);
  //           localStorage.setItem('institution', JSON.stringify(institutions[0]));
  //           this._institutions.set(institutions);
  //           localStorage.setItem('institutions', JSON.stringify(institutions));
  //           return true;
  //         }
  //       } else {
  //         this._institution.set(institutions[0]);
  //         this._institutions.set(institutions);
  //         localStorage.setItem('institution', JSON.stringify(institutions[0]));
  //         localStorage.setItem('institutions', JSON.stringify(institutions));
  //       }
  //     } else {
  //       this._institution.set(institutions[0]);
  //       this._institutions.set(institutions);
  //       localStorage.setItem('institution', JSON.stringify(institutions[0]));
  //       localStorage.setItem('institutions', JSON.stringify(institutions));
  //     }
  //   }

  //   if (this._institution()) {
  //     if (this._institution()?.institution.logoUrl) {
  //       this.uploadService.downloadFile(this._institution()!.institution.logoUrl!).subscribe({
  //         next: (blob: Blob) => {
  //           const url = window.URL.createObjectURL(blob);
  //           this._logoUrl.set(url);
  //           // console.log('Institution logo -----> ', this._logoUrl());
  //         },
  //       });
  //     }
  //   }

  //   // console.log('.....>',this._institution())
  //   return true;
  // }

  private handleProfileSuccess(user: ProfileResponse) {
    this._user.set(user);
    console.log('user handle ', this.user());
    return true;
  }

  private handleRolesSuccess({ roles }: RolesResponse) {
    if (roles.length > 0) {
      const inStorage = localStorage.getItem('role');
      const storedRole = inStorage ? (JSON.parse(inStorage) as Role) : null;
      const active = storedRole
        ? (roles.find((r) => r.id === storedRole.id) ?? roles[0])
        : roles[0];

      this._role.set(active);
      this._roles.set(roles);
      localStorage.setItem('role', JSON.stringify(active));
      localStorage.setItem('roles', JSON.stringify(roles));
    }
    return true;
  }

  setRol(rol: Role) {
    this._role.set(rol);
    localStorage.setItem('role', JSON.stringify(rol));

    window.location.reload();
  }

  forceUpdatePassword(payload: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/auth/update-password`, payload);
  }
}
