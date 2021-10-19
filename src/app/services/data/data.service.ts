import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data = new Map<string, any>();

  constructor() {}

  /**
   * @author helio.souza
   * @description Pega dados guardados via ID.
   * @param id ID vinculado ao dado.
   */
  getData<T>(id: string): T {
    return this.data.get(id);
  }

  /**
   * @author helio.souza
   * @param id ID para ser vinculado ao dado.
   * @param data Dado a ser gravado.
   */
  setData(id: string, data: any): void {
    this.data.set(id, data);
  }

  /**
   * @author helio.souza
   * @param id ID para ser removido junto ao dado.
   */
  removeData(id: string): void {
    this.data.delete(id);
  }

  /**
   * @author helio.souza
   * @description Reseta todos os dados.
   */
  resetData(): void {
    this.data.clear();
  }
}
