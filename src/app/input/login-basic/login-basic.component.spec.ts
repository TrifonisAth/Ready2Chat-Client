import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBasicComponent } from './login-basic.component';

describe('LoginBasicComponent', () => {
  let component: LoginBasicComponent;
  let fixture: ComponentFixture<LoginBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginBasicComponent]
    });
    fixture = TestBed.createComponent(LoginBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
