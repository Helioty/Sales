import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ClienteService } from './cliente/cliente.service';
import { CommonService } from './common/common.service';
import { DataService } from './data/data.service';
import { ConsultaEnderecoService } from './entrega/consulta-endereco.service';
import { BaseService } from './HTTP/base-service.service';
import { CondicaoPagamentoService } from './pagamento/condicao-pagamento.service';
import { PedidoItemService } from './pedido/pedido-item.service';
import { PedidoManutencaoService } from './pedido/pedido-manutencao.service';
import { PedidoService } from './pedido/pedido.service';
import { ProdutoPesquisaService } from './produto-pesquisa/produto-pesquisa.service';
import { ProdutoService } from './produto/produto.service';
import { ScannerService } from './scanner/scanner.service';

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
    ProdutoService,
    ProdutoPesquisaService,
    ScannerService
  ]
})
export class ServicesModule { }
