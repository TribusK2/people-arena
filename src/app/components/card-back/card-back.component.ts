import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UserMark } from 'src/app/model/user-mark.enum';

@Component({
  selector: 'app-card-back',
  templateUrl: './card-back.component.html',
  styleUrls: ['./card-back.component.scss']
})
export class CardBackComponent implements OnInit {
  @Input() userMark: UserMark;
  @Output() cardClick: EventEmitter<UserMark> = new EventEmitter();

  public userClass: string;

  ngOnInit(): void {
    this.userClass = this.getUserClass(this.userMark);
  }

  getUserClass(userMark: UserMark): string {
    return userMark === UserMark.A ? 'cardBack__userA' : 'cardBack__userB'
  }

  onCardClick(): void {
    this.cardClick.emit(this.userMark);
  }
}
