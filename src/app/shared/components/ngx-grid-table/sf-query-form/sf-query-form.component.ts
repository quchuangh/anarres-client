import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { IFilter } from '../../filter-input/filter.types';

@Component({
  selector: 'sf-query-form',
  templateUrl: './sf-query-form.component.html',
  styleUrls: ['./sf-query-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfQueryFormComponent implements OnInit {
  @Input() searchSchema!: SFSchema;

  /**
   * 搜索表单默认值
   */
  @Input() searchFormData!: any;

  @Input() dataLoading = false;

  @ViewChild(SFComponent) sf!: SFComponent;

  constructor() {}

  ngOnInit(): void {}

  get value(): any {
    return this.sf.value;
  }

  get filter(): IFilter[] {
    return [];
  }

  test($event: any): void {
    console.log($event);
  }
}
