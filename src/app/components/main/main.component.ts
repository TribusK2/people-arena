import { Component, OnInit } from '@angular/core';
import { catchError, combineLatest, forkJoin, map, Observable, Subscription, tap, throwError } from 'rxjs';

import { FighterAvatar } from 'src/app/model/fighter-avatar.enum';
import { UserMark } from 'src/app/model/user-mark.enum';
import { ApiService } from 'src/app/services/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { FighterService } from 'src/app/services/fighter.service';
import { GlobalSpinnerService } from 'src/app/services/global-spinner.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public UserMark = UserMark;
  public cardAUp: boolean;
  public cardBUp: boolean;
  public areFighters: boolean;
  public fightResult$: Observable<string>;
  private cardRotationTime = 600;

  constructor(
    private readonly fighterService: FighterService,
    private readonly apiService: ApiService,
    private readonly globalSpinnerService: GlobalSpinnerService,
    private readonly errorService: ErrorService,
  ) { }

  ngOnInit(): void {
    this.drawFighters();
    this.fightResult$ = this.getFightResult();
  }

  drawFighters(): void {
    this.cardAUp = false;
    this.cardBUp = false;
    this.fighterService.clearWinResult();
    this.errorService.clearErrorMessage();
    this.getFighters();
    setTimeout(() => {
      this.areFighters = true;
    }, this.cardRotationTime);
  }

  onCardBackClick(event: UserMark): void {
    if (event === UserMark.A) {
      this.cardAUp = !this.cardAUp;
    } else if (event === UserMark.B) {
      this.cardBUp = !this.cardBUp;
    }

    if (!!this.cardAUp && !!this.cardBUp) {
      this.fighterService.checkWinner();
    }
  }

  private drawFighterAvatar(): string {
    return FighterAvatar[Math.round(Math.random() * 5)];
  }

  private getFighters(): Subscription {
    this.globalSpinnerService.openLoader();
    const fighterAId = Math.round(Math.random() * 80 + 1);
    const fighterBId = Math.round(Math.random() * 80 + 1);

    return forkJoin([
      this.apiService.getFighter(fighterAId),
      this.apiService.getFighter(fighterBId),
    ]).pipe(
      tap(([fighterA, fighterB]) => {
        const fighterAAvatarUrl = this.fighterService.getFighterAvatarUrl(this.drawFighterAvatar());
        const fighterBAvatarUrl = this.fighterService.getFighterAvatarUrl(this.drawFighterAvatar());
        const fighterAWithAvatar = { fighter: fighterA, avatarUrl: fighterAAvatarUrl }
        const fighterBWithAvatar = { fighter: fighterB, avatarUrl: fighterBAvatarUrl }
        this.fighterService.setFighters(fighterAWithAvatar, fighterBWithAvatar);
        this.globalSpinnerService.closeLoader();
      }),
      catchError(err => {
        this.globalSpinnerService.closeLoader();
        return throwError(() => new Error(err));
      })
    ).subscribe()
  }

  private getFightResult(): Observable<string> {
    return combineLatest([
      this.fighterService.winResult$,
      this.errorService.errorMessage$
    ]).pipe(
      tap(([winner, error]) => {
        if (winner && typeof winner !== 'string' && !error && !!this.cardAUp && !!this.cardBUp) {
          this.fighterService.addWin(winner);
        }
      }),
      map(([winner, error]) => {
        if (error) {
          return error;
        }
        if (!!this.cardAUp && !!this.cardBUp) {
          if (typeof winner === 'string') {
            return winner;
          } else {
            const { name } = winner?.fighter.properties || {};
            return `${name} WIN!`;
          }
        }
        return '';
      }),
    )
  }
}
