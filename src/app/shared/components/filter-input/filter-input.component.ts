import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterType, Options, Shorthand, Symbols } from './filter.types';

@Component({
  selector: 'filter-input',
  templateUrl: './filter-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterInputComponent implements ControlValueAccessor, OnInit {
  @Input() options!: Options[];
  @Input() selectWidth = 80;
  @Input() inputPlaceholder = '';
  @Input() selectPlaceholder = '';

  @Input() filterType!: FilterType;
  @Input() optionShowType: 'i18n' | 'shorthand' | 'symbol' = 'i18n';

  @Input() selectValues: Array<{ label: string; value: any }> = [];
  @Input() defaultOption!: Options;

  value = {} as { option: Options; value: any; filterType: string; valueTo?: any };

  propagateOnChange: (value: any) => void = (_: any) => {};
  propagateOnTouched: (value: any) => void = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef, private translate: TranslateService) {}

  ngOnInit(): void {
    this.value.option = this.defaultOption ? this.defaultOption : this.options[0];
    this.value.filterType = this.filterType;
  }

  registerOnChange(fn: any): void {
    this.propagateOnChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateOnTouched = fn;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value.value = obj;
    } else {
      this.value.value = null;
      this.value.valueTo = null;
    }

    this.updateValue();
    this.cdRef.detectChanges();
  }

  onOptionChange(option: Options): void {
    if (option === 'inRange' || this.value.option === 'inRange') {
      delete this.value.value;
      delete this.value.valueTo;
    }
    this.value.option = option;
    this.updateValue();
  }

  onValueChange(value: any): void {
    if (this.filterType === 'date') {
      this.handDateValue(value);
    } else {
      this.value.value = value;
    }
    this.updateValue();
  }

  onValueToChange(valueTo: any): void {
    this.value.valueTo = valueTo;
    this.updateValue();
  }

  private updateValue(): void {
    if (!this.value.option) {
      this.value.option = this.options[0];
    }
    if (!this.value.filterType) {
      this.value.filterType = this.filterType;
    }

    if (this.value.option !== 'inRange') {
      delete this.value.valueTo;
    }

    if (this.value.value && this.value.value.toString().length) {
      this.propagateOnChange(this.value);
    } else {
      this.propagateOnChange({});
    }
  }

  showLabel(option: string): string {
    switch (this.optionShowType) {
      case 'i18n':
        return this.translate.instant(option);
      case 'shorthand':
        // @ts-ignore
        return Shorthand[option];
      case 'symbol':
        // @ts-ignore
        return Symbols[option];
      default:
        return '';
    }
  }

  handDateValue(dates: Date[]): void {
    this.value.value = formatDate(dates[0], 'yyyy-MM-dd HH:mm:ss', 'zh_CH');
    if (this.value.option === 'inRange') {
      this.value.valueTo = formatDate(dates[1], 'yyyy-MM-dd HH:mm:ss', 'zh_CH');
    }
  }

  // handDateValue(dates: Date[]): void {
  //   if (dates[0] &&  dates[1]) {
  //     this.value.value = formatDate(dates[0], 'yyyy-MM-dd HH:mm:ss', 'zh_CH');
  //     this.value.valueTo = formatDate(dates[1], 'yyyy-MM-dd HH:mm:ss', 'zh_CH');
  //     this.value.option = 'inRange';
  //   } else if (dates[0]) {
  //     this.value.value = formatDate(dates[0], 'yyyy-MM-dd HH:mm:ss', 'zh_CH');
  //     this.value.option = 'greaterThanOrEqual';
  //   } else if (dates[1]) {
  //     this.value.value = formatDate(dates[1], 'yyyy-MM-dd HH:mm:ss', 'zh_CH');
  //     this.value.option = 'lessThanOrEqual';
  //   }
  // }
}
