import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsOverviewComponent } from './stats-overview.component';

describe('StatsOverviewComponent', () => {
  let component: StatsOverviewComponent;
  let fixture: ComponentFixture<StatsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsOverviewComponent]
    });
    fixture = TestBed.createComponent(StatsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
