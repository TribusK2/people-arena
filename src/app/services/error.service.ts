import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessageSub = new BehaviorSubject<string>('');

  public errorMessage$ = this.errorMessageSub.asObservable();

  setErrorMessage(message: string): void {
    this.errorMessageSub.next(message);
  }

  clearErrorMessage(): void {
    this.setErrorMessage('');
  }
}
