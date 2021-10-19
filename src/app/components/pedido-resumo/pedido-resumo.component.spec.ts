import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidoResumoComponent } from './pedido-resumo.component';

describe('PedidoResumoComponent', () => {
  let component: PedidoResumoComponent;
  let fixture: ComponentFixture<PedidoResumoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PedidoResumoComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(PedidoResumoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
