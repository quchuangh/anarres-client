import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { IFilter } from '@shared';

@Component({
  selector: 'query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.less'],
})
export class QueryFormComponent implements OnInit {
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
