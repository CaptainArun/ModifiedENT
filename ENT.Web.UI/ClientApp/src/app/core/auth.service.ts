import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import {Login} from '../login/models/login.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: CustomHttpService) {
    //private http: HttpClient   //this.http.post(this.url, { "headers": "my head" }).map()
  }

  authendicate(login: Login): Promise<any> {
    return this.http.post('/Auth/UserAuthendicate', login);
  }

  getUserModels(): Promise<any> {
    return this.http.get('/Auth/GetUserModels').then(res => res);
  }
  //currentUser(): Promise<any> {
  //  return this.http.get('/DRAuth/getCurrentUser');
  //}

  //getUserFacility(userId: number): Promise<any> {
  //  return this.http.get('/DRAuth/getUserFacility?userId=' + userId).then(res=>res);
  //}
}
