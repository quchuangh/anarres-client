import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FilterInputComponent } from './filter-input.component';

@NgModule({
  declarations: [FilterInputComponent],
  exports: [FilterInputComponent],
  imports: [CommonModule, NzInputModule, NzSelectModule, FormsModule, TranslateModule, NzDatePickerModule, NzInputNumberModule],
})
export class FilterInputModule {}
