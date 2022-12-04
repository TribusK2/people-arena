import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

import { FighterWithAvatar } from '../model/fighter.model';
import { UserMark } from '../model/user-mark.enum';
import { Wins } from '../model/wins.model';

@Injectable({
  providedIn: 'root'
})
export class FighterService {
  private fighterASub = new BehaviorSubject<FighterWithAvatar | undefined>(undefined);
  private fighterBSub = new BehaviorSubject<FighterWithAvatar | undefined>(undefined);
  private winResultSub = new BehaviorSubject<FighterWithAvatar | string>('');
  private userWinsSub = new BehaviorSubject<Wins>({ winA: 0, winB: 0 });

  public fighterA$ = this.fighterASub.asObservable();
  public fighterB$ = this.fighterBSub.asObservable();
  public winResult$ = this.winResultSub.asObservable();
  public userWins$ = this.userWinsSub.asObservable();

  setFighters(fighterA: FighterWithAvatar, fighterB: FighterWithAvatar): void {
    this.fighterASub.next(fighterA);
    this.fighterBSub.next(fighterB);
    this.checkWinner();
  }

  getFighter(userMark: UserMark): Observable<FighterWithAvatar> {
    return userMark === UserMark.A ? this.fighterA$.pipe(filter(Boolean)) : this.fighterB$.pipe(filter(Boolean));
  }

  getFighterAvatarUrl(avatar: string): string {
    return `/assets/images/${avatar}.png`
  }

  clearWinResult(): void {
    this.winResultSub.next('');
  }

  checkWinner(): void {
    const fighterA = this.fighterASub.getValue();
    const fighterB = this.fighterBSub.getValue();
    if (fighterA && fighterB) {
      const { mass: userAMass } = fighterA.fighter.properties;
      const { mass: userBMass } = fighterB.fighter.properties;
      const userAMassNumber = Number.parseFloat(userAMass);
      const userBMassNumber = Number.parseFloat(userBMass);
      if (userAMassNumber > userBMassNumber) {
        this.winResultSub.next(fighterA);
      } else if (userAMassNumber < userBMassNumber) {
        this.winResultSub.next(fighterB);
      } else if (userAMassNumber === userBMassNumber) {
        this.winResultSub.next('Both survive!');
      }
    }
  }

  addWin(fighter: FighterWithAvatar): void {
    const fighterA = this.fighterASub.getValue();
    const fighterB = this.fighterBSub.getValue();
    if (fighterA && fighterB) {
      const { winA, winB } = this.userWinsSub.getValue();
      const userWins = { winA, winB };
      if (fighter && (fighter === fighterA)) {
        userWins.winA += 1;
      } else if (fighter && (fighter === fighterB)) {
        userWins.winB += 1;
      }
      this.userWinsSub.next(userWins);
    }
  }

  resetWins(): void {
    this.userWinsSub.next({ winA: 0, winB: 0 });
  }
}
