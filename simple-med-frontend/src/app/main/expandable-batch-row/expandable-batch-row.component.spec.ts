import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableBatchRowComponent } from './expandable-batch-row.component';

describe('ExpandableBatchRowComponent', () => {
  let component: ExpandableBatchRowComponent;
  let fixture: ComponentFixture<ExpandableBatchRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandableBatchRowComponent]
    });
    fixture = TestBed.createComponent(ExpandableBatchRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
