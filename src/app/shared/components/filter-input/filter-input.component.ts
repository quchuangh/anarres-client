import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterType, Shorthand, Symbols } from './filter.types';

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
  @Input() options!: string[];
  @Input() selectWidth = 80;
  @Input() inputPlaceholder = '';
  @Input() selectPlaceholder = '';

  @Input() filterType!: FilterType;
  @Input() optionShowType: 'i18n' | 'shorthand' | 'symbol' = 'i18n';

  @Input() selectValues: Array<{ label: string; value: any }> = [];

  value = {} as { option: string; value: any };

  propagateOnChange: (value: any) => void = (_: any) => {};
  propagateOnTouched: (value: any) => void = (_: any) => {};

  constructor(private cdRef: ChangeDetectorRef, private translate: TranslateService) {}

  ngOnInit(): void {
    this.value.option = this.options[0];
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
      this.cdRef.detectChanges();
    }
  }

  selectOnChange($event: any): void {
    this.value.option = $event;
    this.updateValue();
  }

  inputOnChange($event: any): void {
    this.value.value = $event;
    this.updateValue();
  }

  private updateValue(): void {
    if (!this.value.option) {
      this.value.option = this.options[0];
    }
    this.propagateOnChange(this.value);
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
}
