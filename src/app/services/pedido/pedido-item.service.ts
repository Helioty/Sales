import { Injectable } from '@angular/core';
import { PedidoItem } from './pedido.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoItemService {
  constructor() {}

  // edit by Helio 10/03/2020
  public getItemPedido() {
    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVendaItem/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.pedidoService.numPedido +
    //   '/itens';
    // return new Promise((resolve) => {
    //   this.baseService.get(link).then(
    //     (result: any) => {
    //       this.pedidoService.qtdItensSacola = result.totalElements;
    //       this.pedidoItens = result.content;
    //       resolve(result);
    //     },
    //     (error: any) => {
    //       console.log(error);
    //     }
    //   );
    // });
  }

  // by Helio 09/07/2020
  public addItemPedido(body: PedidoItem) {
    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVendaItem/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.pedidoService.numPedido +
    //   '?update=S';
    // return new Promise((resolve) => {
    //   this.baseService.post(link, body).then(
    //     (result: any) => {
    //       this.pedidoService.atualizaPedidoHeader(result);
    //       resolve(result);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // });
  }
}
