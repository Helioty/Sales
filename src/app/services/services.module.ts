import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { CommonService } from './common/common.service';
import { DataService } from './data/data.service';
import { BaseService } from './http/base.service';
import { PedidoService } from './pedido/pedido.service';
import { ScannerService } from './scanner/scanner.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthService,
    BaseService,
    // ClienteService,
    CommonService,
    DataService,
    // CondicaoPagamentoService,
    // ConsultaEnderecoService,
    PedidoService,
    // PedidoItemService,
    // PedidoManutencaoService,
    // ProdutoService,
    // ProdutoPesquisaService,
    ScannerService,
  ],
})
export class ServicesModule {}
