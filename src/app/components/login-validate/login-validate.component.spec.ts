import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginValidateComponent } from './login-validate.component';

describe('LoginValidateComponent', () => {
  let component: LoginValidateComponent;
  let fixture: ComponentFixture<LoginValidateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginValidateComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginValidateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
