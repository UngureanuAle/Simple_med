import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicReceiptSaleOverviewComponent } from './electronic-receipt-sale-overview.component';

describe('ElectronicReceiptSaleOverviewComponent', () => {
  let component: ElectronicReceiptSaleOverviewComponent;
  let fixture: ComponentFixture<ElectronicReceiptSaleOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectronicReceiptSaleOverviewComponent]
    });
    fixture = TestBed.createComponent(ElectronicReceiptSaleOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
