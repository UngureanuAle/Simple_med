import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionSummaryComponent } from './prescription-summary.component';

describe('PrescriptionSummaryComponent', () => {
  let component: PrescriptionSummaryComponent;
  let fixture: ComponentFixture<PrescriptionSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionSummaryComponent]
    });
    fixture = TestBed.createComponent(PrescriptionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
