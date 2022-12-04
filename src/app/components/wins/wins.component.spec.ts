import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BehaviorSubject, of, Subscription } from 'rxjs';

import { FighterService } from 'src/app/services/fighter.service';
import { WinsComponent } from './wins.component';

describe('WinsComponent', () => {
  let component: WinsComponent;
  let fixture: ComponentFixture<WinsComponent>;
  let fighterService: jasmine.SpyObj<FighterService>;

  beforeEach(async () => {
    const fighterServiceSpy = { ...jasmine.createSpyObj('FighterService', ['resetWins']), userWins$: of('') };

    await TestBed.configureTestingModule({
      declarations: [WinsComponent],
      providers: [
        { provide: FighterService, useValue: fighterServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WinsComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fighterService = TestBed.inject(FighterService) as jasmine.SpyObj<FighterService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('check ngOnInit', () => {
    let sub: Subscription;

    it('should handle stream without delay', fakeAsync(() => {
      fighterService.userWins$ = new BehaviorSubject({ winA: 0, winB: 0 });
      component.ngOnInit();

      sub = component.userWins$.subscribe(res => {
        expect(res).toEqual({ winA: 0, winB: 0 })
      });
      tick(1);
      flush();
    }));

    it('should handle stream with delay', fakeAsync(() => {
      fighterService.userWins$ = new BehaviorSubject({ winA: 1, winB: 0 });
      component.ngOnInit();

      sub = component.userWins$.subscribe(res => {
        expect(res).toEqual({ winA: 1, winB: 0 })
      });
      tick(1200);
      flush();
    }));

    afterEach(() => {
      expect(sub.closed).toBeFalse();
      sub.unsubscribe();
      expect(sub.closed).toBeTrue();
    })
  });



  it('check resetWins', () => {
    component.resetWins();
    expect(fighterService.resetWins).toHaveBeenCalledTimes(1);
  });
});
