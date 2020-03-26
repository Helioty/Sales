import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth/auth.service';
import { BaseService } from './base-service.service';
import { ClienteService } from './cliente/cliente.service';
import { CommonService } from './common/common.service';
import { DataService } from './data/data.service';
import { CondicaoPagamentoService } from './pagamento/condicao-pagamento.service';
import { ConsultaEnderecoService } from './entrega/consulta-endereco.service';
import { PedidoService } from './pedido/pedido.service';
import { PedidoItemService } from './pedido/pedido-item.service';
import { PedidoManutencaoService } from './pedido/pedido-manutencao.service';
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
    CondicaoPagamentoService,
    ConsultaEnderecoService,
    PedidoService,
    PedidoItemService,
    PedidoManutencaoService,
    ProdutoService
  ]
})
export class ServicesModule { }
