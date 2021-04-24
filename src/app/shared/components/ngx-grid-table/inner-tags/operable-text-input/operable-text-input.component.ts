import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-operable-text-input',
  templateUrl: './operable-text-input.component.html',
  styleUrls: ['./operable-text-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OperableTextInputComponent),
      multi: true,
    },
  ],
})
export class OperableTextInputComponent implements ControlValueAccessor, OnInit {
  constructor() {}

  ngOnInit(): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
