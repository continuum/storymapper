import { Injectable } from '@angular/core';

@Injectable()
export class PivotalAuthService {

  constructor() { }


  saveApiToken(token: string): void {
    window.localStorage.setItem('pivotalToken', token);
  }

  getApiToken(): string {
    return window.localStorage.getItem('pivotalToken');
  }


}
