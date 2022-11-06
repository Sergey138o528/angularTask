import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http'
import { IAuthToken } from '../common/IAuthToken';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly authUrl ='http://kong.fte3.10.97.145.65.nip.io/sso/auth/realms/mts/protocol/openid-connect/token';
  public authToken$ = new BehaviorSubject<string>("");
  public authError$ = new Subject<string>();
  
  constructor(private httpClient: HttpClient) { }

  fetchToken(login: string, password: string): Observable<IAuthToken> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    const options = {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Basic ' + btoa(login + ':' + password)),
    };

    return this.httpClient
      .post<IAuthToken>(this.authUrl, body.toString(), options)
      .pipe(
        catchError(
          (err: HttpErrorResponse) => 
          throwError(
              () => new Error(`${err.error.error} (${err.error.error_description})`)
          )
        )
      );
  }

}

