import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ClienteService } from '../cliente/cliente.service';
import { CommonService } from '../common/common.service';
import { PedidoService } from './pedido.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoManutencaoService {
  // private requestCliente = 0;

  constructor(
    private common: CommonService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private navControl: NavController
  ) {}

  // by Helio 20/03/2020, ajusta as informações do pedido para fazer manutenção
  async reabrirPedido(pedido: any) {
    await this.common.showLoader();
    this.pedidoService.atualizaPedidoHeader(pedido);
    // this.pedidoService.numPedido = pedido.numpedido;
    // this.pedidoService.digitoPedido = pedido.digito;
    // this.pedidoService.qtdItensSacola = pedido.numitens;

    if (pedido.cgccpf_cliente !== null && pedido.cgccpf_cliente.length > 10) {
      this.pedidoService.docCliente = pedido.cgccpf_cliente;
      this.pedidoService.clientSelected = true;
      // await this.reGetCliente(pedido.cgccpf_cliente);
    }

    this.navControl.navigateRoot(['/pedido-atalhos']).then(() => {
      this.common.loading.dismiss();
    });
  }

  // async reGetCliente(clie: string) {
  //   await this.clienteService.getClienteNoAlert(clie).then((result) => {
  //     this.pedidoService.dadosCliente = result;
  //   }, () => {
  //     setTimeout(() => {
  //       this.reGetCliente(clie);
  //     }, 500);
  //   });
  // }
}
