import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BrandService } from '@brand';
import { _HttpClient } from '@delon/theme';
import { ScrollbarDirective } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, timer } from 'rxjs';
import { concatMap, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private inited = false;
  userVisible = false;
  q = '';
  i: any = null;
  user: any;
  messages: any[] = [];
  text = '';

  @ViewChild('messageScrollbar', { static: false })
  messageScrollbar?: ScrollbarDirective;

  constructor(public brand: BrandService, private http: _HttpClient, public msg: NzMessageService, private cd: ChangeDetectorRef) {
    brand.notify
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(() => this.inited),
      )
      .subscribe(() => this.cd.detectChanges());
  }

  private scrollToBottom(): void {
    if (!this.unsubscribe$.closed) {
      this.cd.detectChanges();
    }
    setTimeout(() => this.messageScrollbar?.scrollToBottom());
  }

  ngOnInit(): void {
    this.inited = true;
    this.findUser();
    timer(0, 1000 * 3)
      .pipe(
        takeUntil(this.unsubscribe$),
        concatMap(() => this.http.get('/chat/message')),
      )
      .subscribe((res: any) => {
        this.messages.push(res);
        this.scrollToBottom();
      });
  }

  findUser(): void {
    this.http.get('/chat', { q: this.q }).subscribe((res: any) => {
      this.i = res;
      this.user = res.users[1];
      this.user.active = true;
      this.cd.detectChanges();
    });
  }

  choUser(i: any): void {
    if (this.user.id === i.id) {
      return;
    }
    this.user.active = false;
    i.active = true;
    this.user = i;
    this.messages.length = 0;
    this.cd.detectChanges();
    setTimeout(() => this.messageScrollbar?.scrollToTop());
  }

  enterSend(e: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if (e.keyCode !== 13) {
      return;
    }
    this.send();
  }

  send(): void {
    if (!this.text) {
      return;
    }

    this.messages.push({
      type: 'text',
      msg: this.text,
      dir: 'right',
    });
    this.text = '';
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }
}
