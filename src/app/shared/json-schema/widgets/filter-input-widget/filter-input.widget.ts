import { Component, OnInit } from '@angular/core';
import { ControlUIWidget, SFValue } from '@delon/form';
import { SFSchemaType } from '@delon/form/src/schema';
import { SFUISchemaItem } from '@delon/form/src/schema/ui';
import { FilterType } from '../../../components/filter-input/filter.types';

export interface FilterSFUISchemaItem extends SFUISchemaItem {
  options?: string[];
  selectWidth?: number;
  inputPlaceholder?: string;
  selectPlaceholder?: string;
  filterType: FilterType;
  optionShowType: 'i18n' | 'shorthand' | 'symbol';
  selectValues: Array<{ label: string; value: any } | string>;
  change?: (value: SFValue) => void;
}

@Component({
  selector: 'sf-filter-input',
  template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
      <filter-input
        style="margin: 4px 0; display: block"
        [inputPlaceholder]="ui.placeholder || ui.inputPlaceholder"
        [selectPlaceholder]="ui.selectPlaceholder ? ui.selectPlaceholder : ''"
        [selectWidth]="ui.selectWidth"
        [filterType]="ui.filterType ? ui.filterType : schemaTypeToFilterType(schema.type, schema.format)"
        [optionShowType]="ui.optionShowType"
        [selectValues]="ui.selectValues"
        [ngModel]="value"
        [options]="ui.options"
        (ngModelChange)="onChange($event)"
      ></filter-input>
    </sf-item-wrap>
  `,
})
export class FilterInputWidget extends ControlUIWidget<FilterSFUISchemaItem> implements OnInit {
  static readonly KEY = 'filter-input';

  ngOnInit(): void {}

  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: SFValue): void {
    if (this.ui.change) {
      this.ui.change(value);
    }
    this.setValue(value);
  }

  onChange(value: any): void {
    this.reset(value);
  }

  schemaTypeToFilterType(schema: SFSchemaType, format: string): FilterType {
    switch (schema) {
      case 'integer':
      case 'number':
        return 'number';
      case 'array':
      case 'boolean':
        return 'set';
      case 'string':
        if (format && format.startsWith('date')) {
          return 'date';
        } else {
          return 'text';
        }
      default:
        return 'text';
    }
  }
}
