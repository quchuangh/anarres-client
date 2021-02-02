import { ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { CalendarTheme } from '../calendar.theme';

@Component({
  selector: 'app-calendar-basic',
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarBasicComponent extends CalendarTheme implements OnInit, OnDestroy {
  constructor(private http: _HttpClient, zone: NgZone, @Inject(ALAIN_I18N_TOKEN) i18n: I18NService) {
    super(zone, i18n);
  }

  private loadEvents(time: Date): void {
    this.http.get(`/calendar?time=${+time}`).subscribe((res: any) => {
      this._executeOnStable(() => {
        this.instance.addEventSource({
          defaultAllDay: true,
          events: res,
        });
      });
    });
  }

  ngOnInit(): void {
    this.init();
    this.loadEvents(new Date());
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
