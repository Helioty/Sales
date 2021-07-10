import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClienteCadastroEdicaoPage } from './cliente-cadastro-edicao.page';

describe('ClienteCadastroEdicaoPage', () => {
  let component: ClienteCadastroEdicaoPage;
  let fixture: ComponentFixture<ClienteCadastroEdicaoPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClienteCadastroEdicaoPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteCadastroEdicaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
