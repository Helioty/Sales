import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
