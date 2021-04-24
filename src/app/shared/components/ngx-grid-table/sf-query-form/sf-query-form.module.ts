import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SHARED_ZORRO_MODULES } from '../../../shared-zorro.module';
import { FilterInputModule } from '../../filter-input/filter-input.module';
import { SfQueryFormComponent } from './sf-query-form.component';

const COMPONENTS = [SfQueryFormComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    FilterInputModule,
    ...SHARED_ZORRO_MODULES,

    TranslateModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, FilterInputModule],
})
export class SfQueryFormModule {}
