import { ChangeDetectorRef, Component, forwardRef, Input, OnInit, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select/select.types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

export interface ObjectSelectOption {
  id: string;
  title?: string;
  maxTagCount?: number;
  allowClear?: boolean;
  valueParser?: (value: any, data: any) => any;
  style?: { [key: string]: any };
  placeHolder?: string;
  serverSearch?: boolean;
  showArrow?: boolean;
  mode?: 'multiple' | 'tags' | 'default';
  showSearch?: boolean;
  loading?: boolean;
  compareWith?: (o1: any, o2: any) => boolean;
  maxMultipleCount?: number;

  options: (searchValue: string) => Observable<Array<NzSelectOptionInterface>>;
}

@Component({
  selector: 'app-object-select',
  templateUrl: './object-select.component.html',
  styleUrls: ['./object-select.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObjectSelectComponent),
      multi: true,
    },
  ],
})
export class ObjectSelectComponent implements OnInit, ControlValueAccessor {
  value: { [key: string]: any } = {};
  width = '';
  @Input()
  options: ObjectSelectOption[] = [];

  searchChange$ = new BehaviorSubject<{ value: string; select: ObjectSelectOption } | null>(null);
  itemList: { [key: string]: NzSelectOptionInterface[] } = {};

  loading: { [key: string]: boolean } = {};

  onModelChange = (_: any) => {};
  onModelTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  onSearch(searchValue: string, select: ObjectSelectOption): void {
    this.loading[select.id] = true;
    this.searchChange$.next({ value: searchValue, select });
  }

  writeValue(obj: any): void {
    if (!obj) {
      this.value = {};
    } else if (typeof obj === 'string') {
      this.value = JSON.parse(obj);
    } else {
      this.value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  ngOnInit(): void {
    this.width = `${100 / Object.keys(this.options).length}%`;

    const getItems = (
      params: { value: string; select: ObjectSelectOption } | null,
    ): Observable<{ [key: string]: NzSelectOptionInterface[] }> => {
      if (params) {
        return params.select.options(params.value).pipe(map((data) => ({ [params.select.id]: data })));
      }
      return of({});
    };
    const itemList$: Observable<{ [key: string]: NzSelectOptionInterface[] }> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getItems));
    itemList$.subscribe((next) => {
      this.updateOptions(next);
    });

    this.options.forEach((item) => {
      this.loading[item.id] = true;
      getItems({ select: item, value: '' }).subscribe((next) => {
        this.updateOptions(next);
      });
    });
  }

  updateOptions(next: { [key: string]: NzSelectOptionInterface[] }): void {
    Object.assign(this.itemList, next);
    Object.assign(this.loading, { [Object.keys(next)[0]]: false });
    this.cdr.markForCheck();
  }

  onChange(value: any, item: ObjectSelectOption): void {
    this.onModelTouched();

    if (item.valueParser) {
      this.value = item.valueParser(value, this.value);
    } else {
      Object.assign(this.value, { [item.id]: value });
    }
    this.onModelChange(this.value);
  }
}
