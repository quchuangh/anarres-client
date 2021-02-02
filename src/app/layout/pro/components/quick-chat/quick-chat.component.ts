import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BooleanInput, InputBoolean, InputNumber, NumberInput } from '@delon/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ScrollbarDirective } from '@shared';
import { LayoutProWidgetQuickChatService } from './quick-chat.service';

@Component({
  selector: 'quick-chat',
  templateUrl: './quick-chat.component.html',
  host: {
    '[class.quick-chat]': 'true',
    '[class.quick-chat__collapsed]': 'collapsed',
    '[class.d-none]': '!showDialog',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProWidgetQuickChatComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_height: NumberInput;
  static ngAcceptInputType_width: BooleanInput;
  static ngAcceptInputType_collapsed: BooleanInput;

  private unsubscribe$ = new Subject<void>();
  messages: any[] = [
    { type: 'only-text', msg: '2018-12-12' },
    {
      type: 'text',
      dir: 'left',
      mp: './assets/logo-color.svg',
      msg: '请<span class="text-success">一句话</span>描述您的问题，我们来帮您解决并转到合适的人工服务。😎',
    },
  ];
  text = '';
  inited?: boolean;
  hasMessage = false;

  @ViewChild('messageScrollbar', { static: true }) messageScrollbar?: ScrollbarDirective;

  // #region fileds
  @Input() @InputNumber() height = 380;
  @Input() @InputNumber() @HostBinding('style.width.px') width = 320;
  @Input() @InputBoolean() collapsed = true;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();
  @Output() readonly closed = new EventEmitter<boolean>();
  // #endregion

  constructor(private srv: LayoutProWidgetQuickChatService, private cdr: ChangeDetectorRef) {}

  get showDialog(): boolean {
    return this.srv.showDialog;
  }

  private scrollToBottom(): void {
    this.cdr.detectChanges();
    setTimeout(() => this.messageScrollbar!.scrollToBottom());
  }

  toggleCollapsed(): void {
    this.hasMessage = false;
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  close(): void {
    this.srv.close();
    this.closed.emit(true);
  }

  enterSend(e: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if (e.keyCode !== 13) {
      return;
    }
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.send();
  }

  send(): boolean {
    if (!this.text) {
      return false;
    }

    if (typeof this.inited === 'undefined') {
      this.inited = true;
    }
    const item = {
      type: 'text',
      msg: this.text,
      dir: 'right',
    };
    this.srv.send(item);
    this.messages.push(item);
    this.text = '';
    this.scrollToBottom();
    return false;
  }

  ngOnInit(): void {
    const { srv, messages, unsubscribe$ } = this;
    srv.message.pipe(takeUntil(unsubscribe$)).subscribe((res) => {
      if (this.collapsed) {
        this.hasMessage = true;
      }
      messages.push(res);
      this.scrollToBottom();
    });
    srv.status.pipe(takeUntil(unsubscribe$)).subscribe((res) => {
      this.inited = res === 'online' ? false : undefined;
    });
  }

  ngOnDestroy(): void {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }
}
