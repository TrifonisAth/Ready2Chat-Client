import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBasicComponent } from './register-basic.component';

describe('RegisterBasicComponent', () => {
  let component: RegisterBasicComponent;
  let fixture: ComponentFixture<RegisterBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterBasicComponent]
    });
    fixture = TestBed.createComponent(RegisterBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
