import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnum, SFSelectWidgetSchema } from '@delon/form';

@Component({
  selector: 'app-add-item-dict',
  templateUrl: './add-item.component.html',
})
export class SysDictAddItemComponent implements OnInit {
  rolePrefix = 'dictType:';

  @Input()
  record: any;

  @Output()
  onClose = new EventEmitter<boolean>();

  constructor(private msgSrv: NzMessageService, private http: _HttpClient) {}

  ngOnInit(): void {}

  save(value: any) {
    this.http.post(`/api/dict/type/edit`, value).subscribe((res) => {
      this.msgSrv.success('修改成功');
    });
  }

  close(): void {
    this.onClose.emit(false);
  }
}
