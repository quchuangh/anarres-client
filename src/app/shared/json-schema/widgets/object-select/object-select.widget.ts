import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';
import { ObjectSelectOption } from '../../../components/object-select';

@Component({
  selector: 'sf-object-select',
  templateUrl: './object-select.widget.html',
  styleUrls: ['./object-select.widget.less'],
})
// tslint:disable-next-line:component-class-suffix
export class ObjectSelectWidget extends ControlWidget implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'object-select';

  options: ObjectSelectOption[] = [];

  defaultValue = {};

  ngOnInit(): void {
    this.options = this.ui.options;
    this.defaultValue = this.value || this.schema.default;
  }

  reset(value: string): void {
    console.log(value);
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
