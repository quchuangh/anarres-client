import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutProWidgetQuickChatService } from './quick-chat.service';

@Component({
  selector: 'quick-chat-status',
  templateUrl: './quick-chat-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProWidgetQuickChatStatusComponent implements OnInit, OnDestroy {
  private status$!: Subscription;

  status = 'default';

  constructor(private srv: LayoutProWidgetQuickChatService, private cdr: ChangeDetectorRef) {}

  show(): void {
    if (this.srv.showDialog) {
      return;
    }
    this.srv.showDialog = true;
  }

  ngOnInit(): void {
    this.status$ = this.srv.status.subscribe((res) => {
      switch (res) {
        case 'online':
          this.status = 'success';
          break;
        default:
          this.status = 'default';
          break;
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.status$.unsubscribe();
  }
}
