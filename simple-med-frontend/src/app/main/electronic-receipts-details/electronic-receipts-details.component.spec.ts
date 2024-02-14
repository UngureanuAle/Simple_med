import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicReceiptsDetailsComponent } from './electronic-receipts-details.component';

describe('ElectronicReceiptsDetailsComponent', () => {
  let component: ElectronicReceiptsDetailsComponent;
  let fixture: ComponentFixture<ElectronicReceiptsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectronicReceiptsDetailsComponent]
    });
    fixture = TestBed.createComponent(ElectronicReceiptsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
