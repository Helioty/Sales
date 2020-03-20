import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from '../base-service.service';
import { CommonService } from '../common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoTable, PedidoItens } from 'src/app/class/pedido';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoItemService {

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private common: CommonService,
    private pedidoService: PedidoService,
    private navControl: NavController
  ) { }

  // edit by Helio 10/03/2020
  public getItemPedido() {
    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVendaItem/' +
      localStorage.getItem('empresa') + '/' +
      this.pedidoService.numPedido + '/itens';

    return new Promise((resolve) => {
      this.baseService.get(link).then((result: any) => {
        this.pedidoService.qtdItensSacola = result.totalElements;
        resolve(result);
      }, (error: any) => {
        console.log(error);
      });
    });
  }

  // by Helio 10/03/2020
  public addFast(body: PedidoItens) {
    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVendaItem/' +
      localStorage.getItem('empresa') + '/' +
      this.pedidoService.numPedido + '/addfast';

    return new Promise((resolve) => {
      this.baseService.post(link, body).then((result: any) => {
        this.pedidoService.atualizaPedidoHeader(result.pedido);
        this.pedidoService.qtdItensSacola = result.items.totalElements;
        resolve(result.items);
      }, (error) => {
        console.log(error);
      });
    });
  }

  // by Helio 11/03/2020
  public removeItemPedido(codigoProduto: string) {
    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVendaItem/' +
      localStorage.getItem('empresa') + '/' +
      this.pedidoService.numPedido + '/' + codigoProduto;

    return new Promise((resolve) => {
      this.baseService.post(link, {}).then((result: any) => {
        resolve(result);
      }, (error) => {
        console.log(error);
      });
    });
  }

}
