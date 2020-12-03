import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProdutoAdicionarSacolaPage } from './produto-adicionar-sacola.page';

describe('ProdutoAdicionarSacolaPage', () => {
  let component: ProdutoAdicionarSacolaPage;
  let fixture: ComponentFixture<ProdutoAdicionarSacolaPage>;

  beforeEach(waitForAsync(() => {
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
