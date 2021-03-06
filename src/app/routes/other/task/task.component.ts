import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { BrandService } from '@brand';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnInit {
  type = 1;
  list: any[] = [];

  constructor(private http: _HttpClient, public msg: NzMessageService, public brand: BrandService) {}

  ngOnInit(): void {
    this.http.get('/task').subscribe((res: any) => (this.list = res));
  }

  del(p: any, i: any, idx: number): void {
    this.http.delete('/task', { cid: p.id, id: i.id }).subscribe(() => {
      this.msg.success('Success');
      p.list.splice(idx, 1);
    });
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
