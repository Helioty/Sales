import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoAdicionarSacolaPage } from './produto-adicionar-sacola.page';

describe('ProdutoAdicionarSacolaPage', () => {
  let component: ProdutoAdicionarSacolaPage;
  let fixture: ComponentFixture<ProdutoAdicionarSacolaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutoAdicionarSacolaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoAdicionarSacolaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
