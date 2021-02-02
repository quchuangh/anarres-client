import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import { BrandService } from '@brand';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'email-sidebox',
  templateUrl: './sidebox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSideboxComponent implements AfterViewInit, OnChanges, OnDestroy {
  private brand$: Subscription;
  private inited = false;
  // Must be the same as `@email-sidebox-width`
  width = 250;
  type = 1;

  @Input()
  visible = false;

  @Output()
  visibleChange = new EventEmitter<boolean>();

  @Output()
  changed = new EventEmitter<number>();

  constructor(public brand: BrandService, public msg: NzMessageService, private cd: ChangeDetectorRef) {
    this.brand$ = brand.notify.pipe(filter(() => this.inited)).subscribe(() => this.cd.detectChanges());
  }

  ngAfterViewInit(): void {
    this.inited = true;
    this.changed.emit(this.type);
  }

  ngOnChanges(): void {
    this.cd.detectChanges();
  }

  changeType(type: number): void {
    if (type === this.type) {
      return;
    }
    this.type = type;
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.changed.emit(this.type);
    this.cd.detectChanges();
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnDestroy(): void {
    this.brand$.unsubscribe();
  }
}
