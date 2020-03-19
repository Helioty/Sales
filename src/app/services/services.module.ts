import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth/auth.service';
import { BaseService } from './base-service.service';
import { ClienteService } from './cliente/cliente.service';
import { CommonService } from './common/common.service';
import { DataService } from './data/data.service';
import { PedidoService } from './pedido/pedido.service';
import { ProdutoService } from './produto/produto.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    BaseService,
    ClienteService,
    CommonService,
    DataService,
    PedidoService,
    ProdutoService
  ]
})
export class ServicesModule { }
