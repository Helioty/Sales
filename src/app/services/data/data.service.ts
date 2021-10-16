import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data = new Map<string, any>();

  constructor() {}

  setData(id: string, data: any): void {
    this.data.set(id, data);
  }

  getData<T>(id: string): T {
    return this.data.get(id);
  }

  resetData(): void {
    this.data.clear();
  }
}
