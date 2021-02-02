import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

const ALL = 'All';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styles: [
    `
      ::ng-deep .cdk-global-overlay-wrapper {
        pointer-events: none;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        position: absolute;
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class GalleryComponent implements OnInit {
  list!: any[];
  images!: any[];
  types!: string[];
  imagesLoaded = 0;
  masonryDisabled = true;

  constructor(private http: _HttpClient) {}

  ngOnInit(): void {
    this.http.get('/gallery').subscribe((res: any[]) => {
      this.types = [ALL].concat(...Array.from(new Set(res.map((i) => i.type as string))));
      this.list = res;
      this.changeType(0);
    });
  }

  imgLoaded(): void {
    if (++this.imagesLoaded === this.images.length) {
      this.masonryDisabled = false;
    }
  }

  changeType(typeIdx: number): void {
    const data = deepCopy(this.list);
    const type = this.types[typeIdx];
    this.imagesLoaded = 0;
    this.images = type === ALL ? data : data.filter((w: NzSafeAny) => w.type === type);
  }
}
