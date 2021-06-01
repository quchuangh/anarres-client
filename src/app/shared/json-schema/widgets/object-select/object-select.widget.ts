import { Component, OnInit } from '@angular/core';
import { ControlUIWidget } from '@delon/form';
import { SFUISchemaItem } from '@delon/form/src/schema/ui';
import { ObjectSelectOption } from '../../../components/object-select';

export interface ObjectSelectUISchema extends SFUISchemaItem {
  options: ObjectSelectOption[];
}

@Component({
  selector: 'sf-object-select',
  templateUrl: './object-select.widget.html',
  styleUrls: ['./object-select.widget.less'],
})
// tslint:disable-next-line:component-class-suffix
export class ObjectSelectWidget extends ControlUIWidget<ObjectSelectUISchema> implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'object-select';

  options: ObjectSelectOption[] = [];

  defaultValue = {};

  ngOnInit(): void {
    this.options = this.ui.options;
    this.defaultValue = this.value || this.schema.default;
  }

  reset(value: string): void {
    this.defaultValue = value;
  }

  change(value: any): void {
    const result = JSON.stringify(value);
    if (this.ui.change) {
      this.ui.change(result);
    }
    this.setValue(result);
  }
}
