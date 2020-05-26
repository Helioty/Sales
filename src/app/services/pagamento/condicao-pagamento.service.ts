import { Injectable } from '@angular/core';
import { BaseService } from '../HTTP/base-service.service';
import { CommonService } from '../common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { API_URL } from 'src/app/config/app.config.service';
import { OpcaoParcela } from 'src/app/class/pedido';
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

  // edit by Helio 27/03/2020, usado para pegar as formas de pagamento
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
      });
    });
  }

  // edit by Helio 27/03/2020, usado para pegar as parcelas
  getCondicaoPagamento(codigoCondicao: string, nuPedido: string) {
    const link =
      ENV.WS_VENDAS + API_URL + 'condicaoPagto/list/' +
      localStorage.getItem('empresa') + '/' +
      codigoCondicao + '?pedido=' + nuPedido;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // edit by Helio 27/03/2020, usado para pegar as parcelas
  getCondicaoPagamentoComEntrada(codigoCondicao: string, nuPedido: string, entrada: number) {
    const link =
      ENV.WS_VENDAS + API_URL + 'condicaoPagto/list/' +
      localStorage.getItem('empresa') + '/' +
      codigoCondicao + '?pedido=' + nuPedido +
      '&valorentrada=' + entrada;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // by Hélio 30/03/2020
  async setCondicaoPagamento(opcaoSelect: OpcaoParcela, valor: any) {
    const aResult: any[] = [];

    const table0 = await this.pedidoService.atualizaPedido(
      'tipo_pagamento', this.pedidoService.pedidoHeader.tipodoc
    );
    aResult.push(table0[0]);

    if (opcaoSelect.id !== '' && opcaoSelect.id !== undefined) {
      const table1 = await this.pedidoService.atualizaPedido('condicao_pagto', opcaoSelect.id);
      aResult.push(table1[0]);
    }

    if (valor !== '' && valor !== undefined) {
      const table2 = await this.pedidoService.atualizaPedido('valorentrada', valor.toString());
      aResult.push(table2[0]);
    }

    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVenda/update/' +
      localStorage.getItem('empresa') + '/' +
      this.pedidoService.numPedido;

    console.log('aResult');
    console.log(aResult);
    return new Promise((resolve, reject) => {
      this.baseService.post(link, aResult).then((result: any) => {
        resolve(result);
      }, (error: any) => {
        console.log(error);
        reject(error);
      });
    });
  }

}
