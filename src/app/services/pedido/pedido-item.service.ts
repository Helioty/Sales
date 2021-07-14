import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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
  readonly produtoPorPagina = 10;

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly http: BaseService
  ) {}

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param page Pagina a ser retornada.
   * @returns
   */
  getPedidoItens(numPedido: number, page = 1): Observable<Pagination<PedidoItens>> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVendaItem/${empresa}/${numPedido}/itens?page=${page}&size=${this.produtoPorPagina}`;
    return this.http.get<Pagination<PedidoItens>>(url).pipe(take(1));
  }

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
