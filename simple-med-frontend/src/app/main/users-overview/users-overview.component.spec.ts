import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOverviewComponent } from './users-overview.component';

describe('UsersOverviewComponent', () => {
  let component: UsersOverviewComponent;
  let fixture: ComponentFixture<UsersOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersOverviewComponent]
    });
    fixture = TestBed.createComponent(UsersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
