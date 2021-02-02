import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { XlsxService } from '@delon/abc/xlsx';

@Component({
  selector: 'file-xlsx',
  templateUrl: './xlsx.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileXlsxComponent {
  constructor(private xlsx: XlsxService, private cdr: ChangeDetectorRef) {}
  data: any;

  private render(res: any): void {
    this.data = res;
    this.cdr.detectChanges();
  }

  url(): void {
    this.xlsx.import(`./assets/tmp/demo.xlsx`).then((res) => this.render(res));
  }

  change(e: Event): void {
    const node = e.target as HTMLInputElement;
    this.xlsx.import(node.files![0]).then((res) => this.render(res));
    node.value = '';
  }
}
