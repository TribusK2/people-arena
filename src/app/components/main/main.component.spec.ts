import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { of, Subscription, throwError } from 'rxjs';

import { Fighter, FighterWithAvatar } from 'src/app/model/fighter.model';
import { UserMark } from 'src/app/model/user-mark.enum';
import { ApiService } from 'src/app/services/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { FighterService } from 'src/app/services/fighter.service';
import { GlobalSpinnerService } from 'src/app/services/global-spinner.service';
import { CardBackStubComponent } from 'src/test/stub-components/card-back-stub.component';
import { CardStubComponent } from 'src/test/stub-components/card-stub.component';
import { WinsStubComponent } from 'src/test/stub-components/wins-stub.component';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let fighterService: jasmine.SpyObj<FighterService>;
  let apiService: jasmine.SpyObj<ApiService>;
  let globalSpinnerService: jasmine.SpyObj<GlobalSpinnerService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const fighterServiceSpy = {
      ...jasmine.createSpyObj('FighterService', [
        'clearWinResult',
        'checkWinner',
        'getFighterAvatarUrl',
        'setFighters',
        'addWin'
      ]),
      winResult$: of('')
    };
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getFighter']);
    const globalSpinnerServiceSpy = jasmine.createSpyObj('GlobalSpinnerService', ['openLoader', 'closeLoader']);
    const errorServiceSpy = { ...jasmine.createSpyObj('ErrorService', ['clearErrorMessage']), errorMessage$: of('') };

    await TestBed.configureTestingModule({
      declarations: [MainComponent, WinsStubComponent, CardStubComponent, CardBackStubComponent],
      providers: [
        { provide: FighterService, useValue: fighterServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: GlobalSpinnerService, useValue: globalSpinnerServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fighterService = TestBed.inject(FighterService) as jasmine.SpyObj<FighterService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    globalSpinnerService = TestBed.inject(GlobalSpinnerService) as jasmine.SpyObj<GlobalSpinnerService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check ngOnInit', () => {
    const drawFighters = spyOn(component, 'drawFighters');
    const getFightResult = spyOn(<any>component, 'getFightResult');

    component.ngOnInit();

    expect(drawFighters).toHaveBeenCalledTimes(1);
    expect(getFightResult).toHaveBeenCalledTimes(1);
  });

  it('check drawFighters', fakeAsync(() => {
    const getFighters = spyOn(<any>component, 'getFighters');
    component.cardAUp = true;
    component.cardBUp = true;
    component.areFighters = false;

    component.drawFighters();

    expect(component.cardAUp).toBe(false);
    expect(component.cardBUp).toBe(false);
    expect(fighterService.clearWinResult).toHaveBeenCalledTimes(1);
    expect(errorService.clearErrorMessage).toHaveBeenCalledTimes(1);
    expect(getFighters).toHaveBeenCalledTimes(1);
    expect(component.areFighters).toBe(false);

    tick(600);
    flush();
    expect(component.areFighters).toBe(true);
  }));

  describe('check onCardBackClick', () => {
    describe('if all cards are down', () => {
      beforeEach(() => {
        component.cardAUp = false;
        component.cardBUp = false;
      });

      it('for user A', () => {
        const event = UserMark.A;

        component.onCardBackClick(event);

        expect(component.cardAUp).toBe(true);
        expect(component.cardBUp).toBe(false);
      });

      it('for user B', () => {
        const event = UserMark.B;

        component.onCardBackClick(event);

        expect(component.cardAUp).toBe(false);
        expect(component.cardBUp).toBe(true);
      });

      afterEach(() => {
        expect(fighterService.checkWinner).not.toHaveBeenCalled();
      });
    });

    it('if one card is up', () => {
      component.cardAUp = true;
      component.cardBUp = false;
      const event = UserMark.B;

      component.onCardBackClick(event);

      expect(fighterService.checkWinner).toHaveBeenCalledTimes(1);
    });
  });

  it('check drawFighterAvatar', () => {
    const mathRandom = spyOn(Math, 'random').and.returnValue(0.01);
    let result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_A')

    mathRandom.and.returnValue(0.1);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_B')

    mathRandom.and.returnValue(0.2);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_B')

    mathRandom.and.returnValue(0.3);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_C')

    mathRandom.and.returnValue(0.4);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_C')

    mathRandom.and.returnValue(0.5);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_D')

    mathRandom.and.returnValue(0.6);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_D')

    mathRandom.and.returnValue(0.7);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_E')

    mathRandom.and.returnValue(0.8);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_E')

    mathRandom.and.returnValue(0.9);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_F')

    mathRandom.and.returnValue(0.99);
    result = (<any>component).drawFighterAvatar();
    expect(result).toBe('skull_F')
  });

  it('check getFighters', () => {
    const mathRandom = spyOn(Math, 'random').and.returnValues(0.2, 0.1);
    const fighterA = <Fighter>{
      description: 'fighter A',
      properties: { mass: '10' },
    };
    const fighterB = <Fighter>{
      description: 'fighter B',
      properties: { mass: '20' },
    };
    apiService.getFighter.and.returnValues(of(fighterA), of(fighterB));
    const drawFighterAvatar = spyOn(<any>component, 'drawFighterAvatar').and.returnValues('12', '23')
    fighterService.getFighterAvatarUrl.and.returnValues('skull_A', 'skull_B');

    const sub = (<any>component).getFighters();

    expect(mathRandom).toHaveBeenCalledTimes(2);
    expect(drawFighterAvatar).toHaveBeenCalledTimes(2);
    expect(fighterService.getFighterAvatarUrl).toHaveBeenCalledTimes(2);
    expect(fighterService.getFighterAvatarUrl).toHaveBeenCalledWith('12');
    expect(fighterService.getFighterAvatarUrl).toHaveBeenCalledWith('23');
    expect(globalSpinnerService.closeLoader).toHaveBeenCalledTimes(1);
    expect(fighterService.setFighters).toHaveBeenCalledOnceWith(
      { avatarUrl: 'skull_A', fighter: { description: 'fighter A', properties: <any>{ mass: '10' } } },
      { avatarUrl: 'skull_B', fighter: { description: 'fighter B', properties: <any>{ mass: '20' } } }
    );
    expect(sub.closed).toBeTrue();
  });

  describe('check getFightResult', () => {
    let sub: Subscription;

    it('for empty results', () => {
      fighterService.winResult$ = of('');
      errorService.errorMessage$ = of('');

      sub = (<any>component).getFightResult().subscribe((res: any) => {
        expect(res).toBe('');
      });
    });

    it('if returns error', () => {
      fighterService.winResult$ = of('');
      errorService.errorMessage$ = of('Test error message');

      sub = (<any>component).getFightResult().subscribe((res: any) => {
        expect(res).toBe('Test error message');
      });
    });

    it('if returns result message', () => {
      component.cardAUp = true;
      component.cardBUp = true;
      fighterService.winResult$ = of('Test message');
      errorService.errorMessage$ = of('');

      sub = (<any>component).getFightResult().subscribe((res: any) => {
        expect(res).toBe('Test message');
      });
    });

    it('if should retur a winner', () => {
      component.cardAUp = true;
      component.cardBUp = true;
      fighterService.winResult$ = of(<FighterWithAvatar>{ fighter: { properties: { name: 'Test fighter name' } } });
      errorService.errorMessage$ = of('');

      sub = (<any>component).getFightResult().subscribe((res: any) => {
        expect(res).toBe('Test fighter name WIN!');
      });
    });

    afterEach(() => {
      expect(sub.closed).toBeTrue();
    });
  });
});
