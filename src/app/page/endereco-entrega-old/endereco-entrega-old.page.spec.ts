import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoEntregaOldPage } from './endereco-entrega-old.page';

describe('EnderecoEntregaOldPage', () => {
  let component: EnderecoEntregaOldPage;
  let fixture: ComponentFixture<EnderecoEntregaOldPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnderecoEntregaOldPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnderecoEntregaOldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
