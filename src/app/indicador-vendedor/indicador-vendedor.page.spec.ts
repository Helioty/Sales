import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorVendedorPage } from './indicador-vendedor.page';

describe('IndicadorVendedorPage', () => {
  let component: IndicadorVendedorPage;
  let fixture: ComponentFixture<IndicadorVendedorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorVendedorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorVendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
