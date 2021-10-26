import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../shared/pipes/pipes.module';
import { AdicionarEnderecoComponent } from './adicionar-endereco/adicionar-endereco.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { LoginValidateComponent } from './login-validate/login-validate.component';
import { MenuComponent } from './menu/menu.component';
import { PedidoResumoComponent } from './pedido-resumo/pedido-resumo.component';
import { PesquisaClienteComponent } from './pesquisa-cliente/pesquisa-cliente.component';

@NgModule({
  declarations: [
    MenuComponent,
    FormErrorComponent,
    PedidoResumoComponent,
    LoginValidateComponent,
    PesquisaClienteComponent,
    AdicionarEnderecoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  exports: [
    MenuComponent,
    FormErrorComponent,
    PedidoResumoComponent,
    LoginValidateComponent,
    PesquisaClienteComponent,
    AdicionarEnderecoComponent,
  ],
})
export class ComponentsModule {}
