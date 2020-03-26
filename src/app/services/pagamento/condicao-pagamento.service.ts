import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { CommonService } from '../common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CondicaoPagamentoService {

  constructor(
    private baseService: BaseService,
    private common: CommonService,
    private pedidoService: PedidoService
  ) { }

  getFormaPagamento(nuPedido: string) {
    const link =
      ENV.WS_VENDAS + API_URL + 'condicaoPagto/list/' +
      localStorage.getItem('empresa') + '?pedido=' + nuPedido;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // by Hélio 26/03/2020
  async setTipoPagamento(tipoPagamento: string) {
    const aResult: any = await this.pedidoService.atualizaPedido('tipo_pagamento', tipoPagamento);

    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVenda/update/' +
      localStorage.getItem('empresa') + '/' +
      this.pedidoService.numPedido;

    return new Promise((resolve, reject) => {
      this.baseService.post(link, aResult).then((result: any) => {
        this.pedidoService.atualizaPedidoHeader(result);
        console.log('Result Atualiza tipo pagamento');
        console.log(result);
        resolve(result);
      }, (error: any) => {
        console.log(error);
        reject(error);
      }
      );
    });
  }

}
