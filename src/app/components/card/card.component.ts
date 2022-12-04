import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FighterWithAvatar } from 'src/app/model/fighter.model';
import { UserMark } from 'src/app/model/user-mark.enum';
import { FighterService } from 'src/app/services/fighter.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() userMark: UserMark;

  public fighterAvatarUrl$: Observable<string>;
  public fighterWithAvatar$: Observable<FighterWithAvatar>;

  constructor(private readonly fighterService: FighterService) { }

  ngOnInit(): void {
    this.fighterWithAvatar$ = this.getFighter();
  }

  getFighter(): Observable<FighterWithAvatar> {
    return this.fighterService.getFighter(this.userMark).pipe(
      map(fighterWithAvatar => {
        const { mass } = fighterWithAvatar.fighter.properties;
        fighterWithAvatar.fighter.properties.mass = mass === 'unknown' ? '0' : mass;
        return fighterWithAvatar;
      }),
    );
  }
}
