import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudClientsComponent } from './crud-clients.component';

describe('CrudClientsComponent', () => {
  let component: CrudClientsComponent;
  let fixture: ComponentFixture<CrudClientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudClientsComponent]
    });
    fixture = TestBed.createComponent(CrudClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
