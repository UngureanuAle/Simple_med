import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudBatchesComponent } from './crud-batches.component';

describe('CrudBatchesComponent', () => {
  let component: CrudBatchesComponent;
  let fixture: ComponentFixture<CrudBatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudBatchesComponent]
    });
    fixture = TestBed.createComponent(CrudBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
