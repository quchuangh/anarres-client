import { AfterViewInit, Directive, EventEmitter, Input, OnDestroy, Optional, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BooleanInput, InputBoolean, InputNumber, NumberInput } from '@delon/util';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[delay]:not([noDelay])',
  exportAs: 'delayComp',
})
export class DelayDirective implements AfterViewInit, OnDestroy {
  static ngAcceptInputType_delayTime: NumberInput;
  static ngAcceptInputType_delayFirstEmit: BooleanInput;

  private data$: Subscription | undefined;
  private firstEmit = false;

  @Input() @InputNumber() delayTime = 500;
  @Input() @InputBoolean() delayFirstEmit = false;
  @Output() readonly delayChange = new EventEmitter<any>();

  constructor(@Optional() private ngModel: NgModel) {}

  ngAfterViewInit(): void {
    const { ngModel, delayFirstEmit, delayTime, delayChange } = this;
    if (ngModel == null) {
      return;
    }

    this.firstEmit = delayFirstEmit;
    this.data$ = ngModel.valueChanges?.pipe(debounceTime(delayTime), distinctUntilChanged()).subscribe((res) => {
      if (this.firstEmit === false) {
        this.firstEmit = true;
        return;
      }
      delayChange.emit(res);
    });
  }

  ngOnDestroy(): void {
    if (this.data$) {
      this.data$.unsubscribe();
    }
  }
}
