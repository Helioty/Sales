import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelamentoPage } from './parcelamento.page';

describe('ParcelamentoPage', () => {
  let component: ParcelamentoPage;
  let fixture: ComponentFixture<ParcelamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelamentoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
