import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { Draggable } from '@fullcalendar/interaction';
import { CalendarTheme } from '../calendar.theme';

@Component({
  selector: 'app-calendar-events',
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEventsComponent extends CalendarTheme implements OnInit, OnDestroy {
  private draggable!: Draggable;
  @ViewChild('external', { static: true }) private readonly externalEl!: ElementRef;
  removeAfterDrop = false;

  events = [
    {
      id: 1,
      children: [
        { title: 'Happy', className: 'fc-event-success' },
        { title: 'Metting', className: 'fc-event-warning' },
        { title: 'Dinner', className: 'fc-event-magenta' },
        { title: 'Lunch' },
      ],
    },
    {
      id: 2,
      children: [
        { title: 'Reporting', className: 'fc-event-success' },
        { title: 'Happy Hour', className: 'fc-event-purple' },
        { title: 'Click for Ng Alain', className: 'fc-event-success' },
      ],
    },
  ];

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
    this.options = {
      droppable: true,
      drop: (info) => {
        if (!this.removeAfterDrop) {
          return;
        }
        info.draggedEl.parentNode?.removeChild(info.draggedEl);
      },
    };

    this.init();

    this.draggable = new Draggable(this.externalEl.nativeElement, {
      itemSelector: '.fc-event',
      eventData: (eventEl) => {
        return {
          title: eventEl.innerText.trim(),
          className: eventEl.dataset.classname,
        };
      },
    });
    this.loadEvents(new Date());
  }

  ngOnDestroy(): void {
    this.draggable.destroy();
    this.destroy();
  }
}
