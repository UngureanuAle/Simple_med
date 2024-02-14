import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDialogComponent } from './client-dialog.component';

describe('ClientDialogComponent', () => {
  let component: ClientDialogComponent;
  let fixture: ComponentFixture<ClientDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDialogComponent]
    });
    fixture = TestBed.createComponent(ClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
