import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOverviewComponent } from './sales-overview.component';

describe('SalesOverviewComponent', () => {
  let component: SalesOverviewComponent;
  let fixture: ComponentFixture<SalesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesOverviewComponent]
    });
    fixture = TestBed.createComponent(SalesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
