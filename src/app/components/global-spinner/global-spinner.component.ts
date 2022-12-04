import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GlobalSpinnerService } from 'src/app/services/global-spinner.service';

@Component({
  selector: 'app-global-spinner',
  templateUrl: './global-spinner.component.html',
  styleUrls: ['./global-spinner.component.scss']
})
export class GlobalSpinnerComponent implements OnInit {
  public loading$: Observable<boolean>;

  constructor(private readonly globalSpinnerService: GlobalSpinnerService) { }

  ngOnInit(): void {
    this.loading$ = this.globalSpinnerService.loading$;
  }
}
