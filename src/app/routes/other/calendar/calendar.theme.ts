import { Directive, ElementRef, Inject, NgZone, ViewChild } from '@angular/core';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { Calendar, CalendarOptions, createPlugin, Theme } from '@fullcalendar/core';
import zhCNLocale from '@fullcalendar/core/locales/zh-cn';
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timegridPlugin from '@fullcalendar/timegrid';
import { take } from 'rxjs/operators';

export class AntdTheme extends Theme {}

AntdTheme.prototype.classes = {
  root: 'fc-antd',

  widget: 'fc-antd',
  widgetHeader: 'fc-widget-header',
  widgetContent: 'fc-widget-content',

  tableGrid: 'ant-table',
  tableList: 'ant-table',

  buttonGroup: 'ant-btn-group',
  button: 'ant-btn ant-btn-default',
  buttonActive: 'active',

  cornerLeft: 'fc-corner-left',
  cornerRight: 'fc-corner-right',
  stateDefault: 'fc-state-default',
  stateActive: 'fc-state-active',
  stateDisabled: 'fc-state-disabled',
  stateHover: 'fc-state-hover',
  stateDown: 'fc-state-down',

  popoverHeader: 'fc-widget-header',
  popoverContent: 'fc-widget-content',

  // day grid
  headerRow: 'fc-widget-header',
  dayRow: 'fc-widget-content',

  // list view
  listView: 'fc-widget-content',
};

AntdTheme.prototype.baseIconClass = 'fc-icon';
AntdTheme.prototype.iconClasses = {
  close: 'fc-icon-x',
  prev: 'fc-icon-chevron-left',
  next: 'fc-icon-chevron-right',
  prevYear: 'fc-icon-chevrons-left',
  nextYear: 'fc-icon-chevrons-right',
};
AntdTheme.prototype.rtlIconClasses = {
  prev: 'fc-icon-chevron-right',
  next: 'fc-icon-chevron-left',
  prevYear: 'fc-icon-chevrons-right',
  nextYear: 'fc-icon-chevrons-left',
};
AntdTheme.prototype.iconOverrideOption = 'buttonIcons'; // TODO: make TS-friendly
AntdTheme.prototype.iconOverrideCustomButtonOption = 'icon';
AntdTheme.prototype.iconOverridePrefix = 'fc-icon-';

const antdPlugin = createPlugin({
  themeClasses: {
    antd: AntdTheme,
  },
});

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class CalendarTheme {
  protected instance!: Calendar;
  @ViewChild('calendar', { static: true }) protected readonly calendarEl!: ElementRef<HTMLElement>;
  protected options?: CalendarOptions;

  constructor(private _ngZone: NgZone, @Inject(ALAIN_I18N_TOKEN) private _i18n: I18NService) {}

  protected init(): void {
    this._executeOnStable(() => {
      const options: CalendarOptions = {
        plugins: [interactionPlugin, daygridPlugin, timegridPlugin, listPlugin, antdPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay,listMonth',
        },
        initialView: 'dayGridMonth',
        editable: true,
        dayMaxEventRows: 3,
        navLinks: true,
        themeSystem: 'antd',
        ...this.options,
      };
      if (this._i18n.currentLang.toLocaleLowerCase() === 'zh-cn') {
        options.locale = zhCNLocale;
      }

      this.instance = new Calendar(this.calendarEl.nativeElement, options);
      this.instance.render();
    });
  }

  protected destroy(): void {
    this._executeOnStable(() => {
      if (this.instance) {
        this.instance.destroy();
      }
    });
  }

  protected _executeOnStable(fn: () => any): void {
    if (this._ngZone.isStable) {
      fn();
    } else {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(fn);
    }
  }
}
