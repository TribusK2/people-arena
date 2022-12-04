import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ApiResult, Fighter } from '../model/fighter.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://www.swapi.tech/api';

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService,
  ) { }

  getFighter(fighterId: number): Observable<Fighter> {
    return this.http.get<ApiResult>(`${this.apiUrl}/people/${fighterId}`).pipe(
      map(res => res.result),
      catchError(err => {
        this.errorService.setErrorMessage('Fighter chickened out! Try to find another one.')
        return throwError(() => new Error(err));
      })
    );
  }
}
