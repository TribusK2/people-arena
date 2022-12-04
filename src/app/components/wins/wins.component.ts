import { Component, OnInit } from '@angular/core';
import { delayWhen, interval, Observable } from 'rxjs';

import { FighterService } from 'src/app/services/fighter.service';

@Component({
  selector: 'app-wins',
  templateUrl: './wins.component.html',
  styleUrls: ['./wins.component.scss']
})
export class WinsComponent implements OnInit {
  public userWins$: Observable<{ winA: number, winB: number }>;

  constructor(private readonly fighterService: FighterService) { }

  ngOnInit(): void {
    this.userWins$ = this.fighterService.userWins$.pipe(
      delayWhen((wins) => wins.winA !== 0 || wins.winB !== 0 ? interval(1200) : interval(0)),
    );
  }

  resetWins(): void {
    this.fighterService.resetWins();
  }
}
