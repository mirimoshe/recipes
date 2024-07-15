import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private userURL = `${environment.apiURL}/user`;

  private tokenSubject = new BehaviorSubject<boolean>(false);
  token$ = this.tokenSubject.asObservable();

  public set token(token: string | null) {
    if (token) {
      localStorage.setItem('mytoken', token);
      this.tokenSubject.next(true);
    }
    else{
      localStorage.removeItem('mytoken');
      this.tokenSubject.next(false);
    }
  }

  signup(addUser: User) {
    console.log("user",addUser);
    
    return this.http.post<{ user: User; token: string }>(
      `${this.userURL}/sign-up`,
      addUser
    );
  }

  login(addUser: User) {
    return this.http.post<{ user: User; token: string }>(
      `${this.userURL}/sign-in`,
      addUser
    );
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user_id || null;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  
  getuserById(id:number) {
    console.log("here");
    return this.http.get(`${this.userURL}/${id}`);
  }


  constructor() { }
}
