import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableSalesRowComponent } from './expandable-sales-row.component';

describe('ExpandableSalesRowComponent', () => {
  let component: ExpandableSalesRowComponent;
  let fixture: ComponentFixture<ExpandableSalesRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandableSalesRowComponent]
    });
    fixture = TestBed.createComponent(ExpandableSalesRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
