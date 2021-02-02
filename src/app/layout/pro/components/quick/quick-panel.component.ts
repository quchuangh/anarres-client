import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BrandService } from '../../pro.service';
import { ProLayout } from '../../pro.types';

@Component({
  selector: 'layout-pro-quick-panel',
  templateUrl: './quick-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProWidgetQuickPanelComponent implements OnInit {
  type = 0;
  data: any;
  get layout(): ProLayout {
    return this.pro.layout;
  }

  constructor(private pro: BrandService, private http: _HttpClient, private cd: ChangeDetectorRef, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.http.get('/quick').subscribe((res) => {
      this.data = res;
      this.changeType(0);
    });
  }

  changeType(type: number): void {
    this.type = type;
    // wait checkbox & switch render
    setTimeout(() => this.cd.detectChanges());
  }

  updateSetting(_type: string, _value: any): void {
    this.msg.success('Success!');
  }

  setLayout(name: string, value: any): void {
    this.pro.setLayout(name, value);
  }
}
