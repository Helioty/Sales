import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClienteEnderecosPage } from './cliente-enderecos.page';

describe('ClienteEnderecosPage', () => {
  let component: ClienteEnderecosPage;
  let fixture: ComponentFixture<ClienteEnderecosPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClienteEnderecosPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ClienteEnderecosPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
