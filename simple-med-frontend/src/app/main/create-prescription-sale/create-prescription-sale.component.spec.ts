import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrescriptionSaleComponent } from './create-prescription-sale.component';

describe('CreatePrescriptionSaleComponent', () => {
  let component: CreatePrescriptionSaleComponent;
  let fixture: ComponentFixture<CreatePrescriptionSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePrescriptionSaleComponent]
    });
    fixture = TestBed.createComponent(CreatePrescriptionSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
