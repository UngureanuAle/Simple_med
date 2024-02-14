import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchOverviewComponent } from './batch-overview.component';

describe('BatchOverviewComponent', () => {
  let component: BatchOverviewComponent;
  let fixture: ComponentFixture<BatchOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BatchOverviewComponent]
    });
    fixture = TestBed.createComponent(BatchOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
