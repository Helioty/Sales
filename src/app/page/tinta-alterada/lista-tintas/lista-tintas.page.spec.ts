import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTintasPage } from './lista-tintas.page';

describe('ListaTintasPage', () => {
  let component: ListaTintasPage;
  let fixture: ComponentFixture<ListaTintasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTintasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTintasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
