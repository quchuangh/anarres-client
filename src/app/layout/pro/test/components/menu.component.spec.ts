import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createTestContext } from '@delon/testing';
import { AlainThemeModule, Menu, MenuService } from '@delon/theme';
import { LayoutModule } from '../../../layout.module';
import { LayoutProMenuComponent } from '../../components/menu/menu.component';
import { BrandService } from '../../pro.service';

describe('pro: layout-pro-menu', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dl: DebugElement;
  let context: TestComponent;
  let srv: BrandService;
  let menuSrv: MenuService;
  let page: PageObject;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule.withRoutes([]), AlainThemeModule.forRoot(), LayoutModule],
      declarations: [TestComponent],
    });
    ({ fixture, dl, context } = createTestContext(TestComponent));
    srv = TestBed.inject(BrandService);
    menuSrv = TestBed.inject(MenuService);
    page = new PageObject();
  });

  describe('#menu', () => {
    it('should be ingored category menus', () => {
      page.appendMenu([{ text: '1', children: [{ text: '1-1' }, { text: '1-2' }] }]).checkCount(2);
    });

    it('should be ingored menu item when _hidden is true', () => {
      page.appendMenu([{ text: '1', children: [{ text: '1-1', hide: true }, { text: '1-2' }] }]).checkCount(1);
    });

    it('should be navigate router', fakeAsync(() => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigateByUrl');
      page.appendMenu([{ text: '1', children: [{ text: '1-1', link: '/' }] }]);
      page.click();
      tick(100);
      fixture.detectChanges();
      expect(router.navigateByUrl).toHaveBeenCalled();
    }));

    it('should be auto closed collapse when router changed of mobile', fakeAsync(() => {
      spyOnProperty(srv, 'isMobile').and.returnValue(true);
      const setCollapsedSpy = spyOn(srv, 'setCollapsed');
      page.appendMenu([{ text: '1', children: [{ text: '1-1', link: '/' }] }]).click();
      tick(100);
      fixture.detectChanges();
      expect(setCollapsedSpy).toHaveBeenCalled();
      expect(setCollapsedSpy.calls.mostRecent().args[0]).toBe(true);
    }));
  });

  class PageObject {
    appendMenu(menus: Menu[]): this {
      menuSrv.add(menus);
      fixture.detectChanges();
      return this;
    }
    checkCount(count: number = 0): this {
      expect(context.comp.menus!.length).toBe(count);
      return this;
    }
    click(pos: number = 0): this {
      const el = document.querySelectorAll('.alain-pro__menu-item')[pos] as HTMLElement;
      el.querySelector('a')!.click();
      fixture.detectChanges();
      return this;
    }
    whenStable(): Promise<void> {
      return fixture.whenStable();
    }
  }
});

@Component({
  template: ` <div layout-pro-menu></div> `,
})
class TestComponent {
  @ViewChild(LayoutProMenuComponent, { static: true }) comp!: LayoutProMenuComponent;
}
