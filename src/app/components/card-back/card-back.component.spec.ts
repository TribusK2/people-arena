import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMark } from 'src/app/model/user-mark.enum';

import { CardBackComponent } from './card-back.component';

describe('CardBackComponent', () => {
  let component: CardBackComponent;
  let fixture: ComponentFixture<CardBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardBackComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardBackComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check ngOnInit', () => {
    const getUserClass = spyOn(component, 'getUserClass');
    component.userMark = UserMark.A;

    component.ngOnInit();

    expect(getUserClass).toHaveBeenCalledOnceWith(UserMark.A);
  });

  describe('check getUserClass', () => {
    it('should retur user A class', () => {
      const result = component.getUserClass(UserMark.A);
      expect(result).toBe('cardBack__userA');
    });

    it('should retur user B class', () => {
      const result = component.getUserClass(UserMark.B);
      expect(result).toBe('cardBack__userB');
    });
  });

  it('check onCardClick', () => {
    const cardClickEmit = spyOn(component.cardClick, 'emit');
    component.userMark = UserMark.A;

    component.onCardClick();

    expect(cardClickEmit).toHaveBeenCalledOnceWith(UserMark.A);
  });
});
