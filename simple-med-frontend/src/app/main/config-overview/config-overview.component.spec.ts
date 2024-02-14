import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigOverviewComponent } from './config-overview.component';

describe('ConfigOverviewComponent', () => {
  let component: ConfigOverviewComponent;
  let fixture: ComponentFixture<ConfigOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigOverviewComponent]
    });
    fixture = TestBed.createComponent(ConfigOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
