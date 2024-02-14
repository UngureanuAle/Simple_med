import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicReceiptsOverviewComponent } from './electronic-receipts-overview.component';

describe('ElectronicReceiptsOverviewComponent', () => {
  let component: ElectronicReceiptsOverviewComponent;
  let fixture: ComponentFixture<ElectronicReceiptsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectronicReceiptsOverviewComponent]
    });
    fixture = TestBed.createComponent(ElectronicReceiptsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
