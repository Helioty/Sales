import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from '../http/base.service';
import { FormaPagamento, OpcaoParcela } from './condicao-pagamento.interface';

@Injectable({
  providedIn: 'root',
})
export class CondicaoPagamentoService {
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @description Retorna as formas de pagamento disponiveis para o pedido.
   * @param numPedido Número do Pedido.
   */
  getFormaPagamento(numPedido: number): Observable<FormaPagamento[]> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}condicaoPagto/list/${empresa}?pedido=${numPedido}`;
    return this.http.get<FormaPagamento[]>(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @description Retorna as parcelas disponiveis para a condição de pagamento.
   * @param codigoCondicao Codigo da condição de pagamento.
   * @param numPedido Número do Pedido.
   * @param entrada Valor da Entrada se existente.
   */
  getCondicaoPagamento(
    codigoCondicao: string,
    numPedido: number,
    entrada?: number
  ): Observable<OpcaoParcela[]> {
    const empresa = localStorage.getItem('empresa');
    const baseUrl = `${ENV.WS_VENDAS}${API_URL}condicaoPagto/list/${empresa}/${codigoCondicao}?pedido=${numPedido}`;
    const url = entrada ? baseUrl + '&valorentrada=' + entrada : baseUrl;
    return this.http.get<OpcaoParcela[]>(url).pipe(take(1));
  }

  //   const url =
  //     ENV.WS_VENDAS +
  //     API_URL +
  //     'condicaoPagto/list/' +
  //     localStorage.getItem('empresa') +
  //     '/' +
  //     codigoCondicao +
  //     '?pedido=' +
  //     nuPedido +
  //     '&valorentrada=' +
  //     entrada;
}
