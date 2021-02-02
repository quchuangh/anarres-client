import { Direction, Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, Optional } from '@angular/core';
import { DrawerHelper } from '@delon/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutProWidgetQuickPanelComponent } from './quick-panel.component';

@Component({
  selector: 'layout-pro-quick',
  templateUrl: './quick.component.html',
  host: {
    '[class.alain-pro__header-item]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProWidgetQuickComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private dir: Direction = 'ltr';

  constructor(private drawerHelper: DrawerHelper, @Optional() private directionality: Directionality) {}

  @HostListener('click')
  show(): void {
    this.drawerHelper
      .create(``, LayoutProWidgetQuickPanelComponent, null, {
        size: 480,
        drawerOptions: {
          nzTitle: undefined,
          nzPlacement: this.dir === 'rtl' ? 'left' : 'right',
          nzBodyStyle: {
            'min-height': '100%',
            padding: 0,
          },
        },
      })
      .subscribe();
  }

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
