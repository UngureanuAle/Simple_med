import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGeneralCrudComponent } from './config-general-crud.component';

describe('ConfigGeneralCrudComponent', () => {
  let component: ConfigGeneralCrudComponent;
  let fixture: ComponentFixture<ConfigGeneralCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigGeneralCrudComponent]
    });
    fixture = TestBed.createComponent(ConfigGeneralCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
