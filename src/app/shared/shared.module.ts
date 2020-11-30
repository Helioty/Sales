import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HideKeyboardDirective } from './custom/hide-keyboard.directive';

@NgModule({
  declarations: [
    HideKeyboardDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HideKeyboardDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
