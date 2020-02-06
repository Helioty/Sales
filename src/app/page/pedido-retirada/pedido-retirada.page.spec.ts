import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoRetiradaPage } from './pedido-retirada.page';

describe('PedidoRetiradaPage', () => {
  let component: PedidoRetiradaPage;
  let fixture: ComponentFixture<PedidoRetiradaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoRetiradaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoRetiradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
