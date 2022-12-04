import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FighterWithAvatar } from 'src/app/model/fighter.model';
import { UserMark } from 'src/app/model/user-mark.enum';
import { FighterService } from 'src/app/services/fighter.service';

import { MatCardStubComponent } from 'src/test/stub-components/mat-card-stub.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let fighterService: jasmine.SpyObj<FighterService>;

  beforeEach(async () => {
    const fighterServiceSpy = jasmine.createSpyObj('FighterService', ['getFighter']);

    await TestBed.configureTestingModule({
      declarations: [
        CardComponent,
        MatCardStubComponent
      ],
      providers: [
        { provide: FighterService, useValue: fighterServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fighterService = TestBed.inject(FighterService) as jasmine.SpyObj<FighterService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check ngOnInit', () => {
    const getFighter = spyOn(component, 'getFighter');
    component.ngOnInit();
    expect(getFighter).toHaveBeenCalledTimes(1);
  });

  describe('check getFighter', () => {
    it('if mass property is known', () => {
      component.userMark = UserMark.A;
      const fighterWithAvatar = <FighterWithAvatar>{
        fighter: { properties: { mass: '33' } }
      }
      fighterService.getFighter.and.returnValue(new BehaviorSubject(fighterWithAvatar));

      const sub = component.getFighter().subscribe(res => {
        expect(fighterService.getFighter).toHaveBeenCalledOnceWith(UserMark.A);
        expect(res).toEqual(<FighterWithAvatar>{ fighter: { properties: { mass: '33' } } });
      });

      expect(sub.closed).toBeFalse();
      sub.unsubscribe();
      expect(sub.closed).toBeTrue();
    });

    it('if mass property is unknow', () => {
      component.userMark = UserMark.A;
      const fighterWithAvatar = <FighterWithAvatar>{
        fighter: { properties: { mass: 'unknown' } }
      }
      fighterService.getFighter.and.returnValue(new BehaviorSubject(fighterWithAvatar));

      const sub = component.getFighter().subscribe(res => {
        expect(fighterService.getFighter).toHaveBeenCalledOnceWith(UserMark.A);
        expect(res).toEqual(<FighterWithAvatar>{ fighter: { properties: { mass: '0' } } });
      });

      expect(sub.closed).toBeFalse();
      sub.unsubscribe();
      expect(sub.closed).toBeTrue();
    });
  });
});
