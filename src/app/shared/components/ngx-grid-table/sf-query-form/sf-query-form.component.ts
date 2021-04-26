import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { DateOption, FilterType, IFilter, NumberOption, SetOption, TextOption } from '../../filter-input/filter.types';

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
    const v: any = { ...this.value };
    const filters: IFilter[] = [];
    Object.keys(v).forEach((key) => {
      const obj = v[key];
      if (!(obj.option && obj.filterType)) {
        return;
      }
      const filter = {
        filterType: obj.filterType,
        value: obj.value,
        field: key,
        option: obj.option,
      } as any;
      if (obj.valueTo) {
        filter.valueTo = obj.valueTo;
      }
      filters.push(filter);
    });
    return filters;
  }

  test($event: any): void {
    console.log($event);
  }

  reset(): void {
    this.sf.reset();
  }
}
