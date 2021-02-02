import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlainThemeModule } from '@delon/theme';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { FileManagerImgComponent } from './file-manager-img.component';
import { FileManagerImgDirective } from './file-manager-img.directive';
import { FileManagerComponent } from './file-manager.component';

const COMPONENTS = [FileManagerComponent, FileManagerImgComponent, FileManagerImgDirective];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlainThemeModule.forChild(),
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzPaginationModule,
    NzDropDownModule,
    NzModalModule,
    NzInputModule,
    NzTreeSelectModule,
    NzGridModule,
    NzTreeModule,
    NzSelectModule,
    NzCardModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class FileManagerModule {}
