import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { Pagination } from 'src/app/page/pedido-lista/pedido-lista.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from './../common/common.service';
import { BaseService } from './../http/base.service';
import { PedidoItens } from './pedido.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoItemService {
  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly http: BaseService
  ) {}

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

  // by Helio 10/03/2020
  public addFast(body: PedidoItens) {
    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVendaItem/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.pedidoService.numPedido +
    //   '/addfast';
    // return new Promise((resolve) => {
    //   this.baseService.post(link, body).then(
    //     (result: any) => {
    //       this.pedidoService.atualizaPedidoHeader(result.pedido);
    //       this.pedidoService.qtdItensSacola = result.items.totalElements;
    //       resolve(result.items);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // });
  }

  // by Helio 11/03/2020
  public removeItemPedido(codigoProduto: string) {
    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVendaItem/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.pedidoService.numPedido +
    //   '/' +
    //   codigoProduto;
    // return new Promise((resolve) => {
    //   this.baseService.post(link, {}).then(
    //     (result: any) => {
    //       resolve(result);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // });
  }

  // by Helio 09/07/2020
  public addItemPedido(body: PedidoItens) {
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
