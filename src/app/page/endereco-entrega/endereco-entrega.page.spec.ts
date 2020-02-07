import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoEntregaPage } from './endereco-entrega.page';

describe('EnderecoEntregaPage', () => {
  let component: EnderecoEntregaPage;
  let fixture: ComponentFixture<EnderecoEntregaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnderecoEntregaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnderecoEntregaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
