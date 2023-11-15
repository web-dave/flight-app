import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userName = '';
  get userName() {
    return this._userName;
  }
  login(userName: string, password = '') {
    this._userName = userName;
  }
  logout() {
    this._userName = '';
  }
  isLoggedin() {
    return this._userName !== '';
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService2 {
  private _userName = signal('');
  userName = computed(() => {
    const name = this._userName();
    console.log('!!!', name);

    return name;
  });

  isLoggedin = computed(() => this._userName() !== '');

  login(userName: string, password = '') {
    this._userName.set(userName);
  }
  logout() {
    this._userName.set('');
  }
}

export function authGuard() {
  const auth = inject(AuthService2);
  const router = inject(Router);

  return auth.isLoggedin() ? true : router.createUrlTree(['/']);
}
