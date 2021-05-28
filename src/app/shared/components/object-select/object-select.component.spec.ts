import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectSelectComponent } from './object-select.component';

describe('ObjectSelectComponent', () => {
  let component: ObjectSelectComponent;
  let fixture: ComponentFixture<ObjectSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
