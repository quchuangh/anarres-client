import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ObjectSelectComponent } from './object-select.component';

@NgModule({
  declarations: [ObjectSelectComponent],
  exports: [ObjectSelectComponent],
  imports: [CommonModule, NzSelectModule, NzIconModule, NzInputModule, FormsModule, TranslateModule],
})
export class ObjectSelectModule {}
