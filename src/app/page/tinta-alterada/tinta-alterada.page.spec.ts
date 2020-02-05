import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TintaAlteradaPage } from './tinta-alterada.page';

describe('TintaAlteradaPage', () => {
  let component: TintaAlteradaPage;
  let fixture: ComponentFixture<TintaAlteradaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TintaAlteradaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TintaAlteradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
