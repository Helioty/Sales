import { TestBed, async, inject } from '@angular/core/testing';

import { ListaEnderecoGuard } from './lista-endereco.guard';

describe('ListaEnderecoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaEnderecoGuard]
    });
  });

  it('should ...', inject([ListaEnderecoGuard], (guard: ListaEnderecoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
