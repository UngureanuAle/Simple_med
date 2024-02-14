import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionReaderComponent } from './prescription-reader.component';

describe('PrescriptionReaderComponent', () => {
  let component: PrescriptionReaderComponent;
  let fixture: ComponentFixture<PrescriptionReaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionReaderComponent]
    });
    fixture = TestBed.createComponent(PrescriptionReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
