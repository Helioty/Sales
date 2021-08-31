import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../shared/pipes/pipes.module';
import { FormErrorComponent } from './form-error/form-error.component';
import { MenuComponent } from './menu/menu.component';
import { PesquisaClienteComponent } from './pesquisa-cliente/pesquisa-cliente.component';

@NgModule({
  declarations: [MenuComponent, FormErrorComponent, PesquisaClienteComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  exports: [MenuComponent, FormErrorComponent, PesquisaClienteComponent],
})
export class ComponentsModule {}
