import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalSpinnerService {
  private loadingSub = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSub.asObservable();

  openLoader(): void {
    this.loadingSub.next(true);
  }

  closeLoader(): void {
    this.loadingSub.next(false);
  }
}
