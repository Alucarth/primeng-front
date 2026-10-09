import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UppercaseDirective } from '../../../common/directives/uppercase.directive';
import { AuthService } from '@/auth/services/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { DeviceCompatibilityService } from '../../../common/services/device-compatibility.service';
import { AccountService } from '../../../rrhh/services/account.service';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, UppercaseDirective, ButtonDirective, InputText],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  private readonly _fb = inject(FormBuilder);

  authService = inject(AuthService);
  router = inject(Router);
  accountService = inject(AccountService);
  private deviceCompatibility = inject(DeviceCompatibilityService);
  public form = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  public readonly isLoading = signal(false);
  public readonly showPassword = signal(false);
  public readonly apkPath = signal<string | null>(null);
  public readonly apkModalOpen = signal(false);
  public readonly apkDownload$ = signal<Observable<HttpEvent<Blob>> | null>(null);
  public readonly apkBlockedReason = signal<string | null>(null);

  public async ngOnInit(): Promise<void> {
    // try {
    //   const resp = await firstValueFrom(this.accountService.getApkPath());
    //   this.apkPath.set(resp?.path ?? null);
    // } catch {
    //   this.apkPath.set(null);
    // }
  }

  public togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  public onAutofill(event: AnimationEvent, controlName: 'username' | 'password'): void {
    if (event.animationName !== 'on-autofill') return;

    const control = this.form.get(controlName);
    const value = (event.target as HTMLInputElement).value;
    if (control && value) {
      control.setValue(value);
    }
  }

  public async login(usernameInput?: HTMLInputElement, passwordInput?: HTMLInputElement) {
    this.syncAutofillValues(usernameInput, passwordInput);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // toast.error('Debe llenar los campos solicitados.');
      return;
    }

    this.isLoading.set(true);
    try {
      const isAuthenticated = await firstValueFrom(
        this.authService.login(this.form.value.username!, this.form.value.password!),
      );

      if (isAuthenticated) {
        const profile = await firstValueFrom(this.authService.getProfile());

        this.authService.getRoles().subscribe(() => {
          this.authService.role();
        });

        this.router.navigateByUrl('/');
        return;
      }

      // toast.error('Usuario o Password incorrecto.');
    } catch {
      // toast.error('Error de conexión al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  downloadApk() {
    const check = this.deviceCompatibility.check();

    if (!check.compatible) {
      this.apkBlockedReason.set(check.message);
      this.apkDownload$.set(null);
      this.apkModalOpen.set(true);
      return;
    }

    this.apkBlockedReason.set(null);
    this.apkModalOpen.set(true);
    this.apkDownload$.set(this.accountService.getApkPath());
  }

  onApkModalClose(open: boolean): void {
    this.apkModalOpen.set(open);
    if (!open) {
      this.apkDownload$.set(null);
      this.apkBlockedReason.set(null);
    }
  }

  private syncAutofillValues(
    usernameInput?: HTMLInputElement,
    passwordInput?: HTMLInputElement,
  ): void {
    const username = this.form.get('username');
    const password = this.form.get('password');

    if (usernameInput?.value && username && !username.value) {
      username.setValue(usernameInput.value);
    }
    if (passwordInput?.value && password && !password.value) {
      password.setValue(passwordInput.value);
    }
  }
}
