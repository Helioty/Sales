import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from '../base-service.service';
import { CommonService } from '../common/common.service';
import { PedidoService } from './pedido.service';
import { ClienteService } from '../cliente/cliente.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoManutencaoService {

  // private requestCliente = 0;

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private common: CommonService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private navControl: NavController
  ) { }

  // by Helio 20/03/2020, ajusta as informações do pedido para fazer manutenção
  async reabrirPedido(pedido: any) {
    await this.common.showLoader();
    this.pedidoService.numPedido = pedido.numpedido;
    this.pedidoService.digitoPedido = pedido.digito;
    this.pedidoService.qtdItensSacola = pedido.numitens;

    if (pedido.cgccpf_cliente !== null && pedido.cgccpf_cliente.length > 10) {
      this.pedidoService.docCliente = pedido.cgccpf_cliente;
      this.pedidoService.clientSelected = true;
      // await this.reGetCliente(pedido.cgccpf_cliente);
    }

  }

  async reGetCliente(clie: string) {
    await this.clienteService.getClienteNoAlert(clie).then((result) => {
      this.pedidoService.dadosCliente = result;
    }, () => {
      setTimeout(() => {
        this.reGetCliente(clie);
      }, 500);
    });
  }

}
