import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from '../http/base.service';

@Injectable({
  providedIn: 'root',
})
export class CondicaoPagamentoService {
  constructor(private readonly http: BaseService) {}

  // edit by Helio 27/03/2020, usado para pegar as formas de pagamento
  /**
   * @author helio.souza
   * @param numPedido
   * @returns
   */
  getFormaPagamento(numPedido: number): Observable<any> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}condicaoPagto/list/${empresa}?pedido=${numPedido}`;
    return this.http.get(url).pipe(take(1));
  }

  // edit by Helio 27/03/2020, usado para pegar as parcelas
  /**
   * @author helio.souza
   * @param codigoCondicao
   * @param numPedido
   * @param entrada
   */
  getCondicaoPagamento(
    codigoCondicao: string,
    numPedido: number,
    entrada?: number
  ): Observable<any> {
    const empresa = localStorage.getItem('empresa');
    const baseUrl = `${ENV.WS_VENDAS}${API_URL}condicaoPagto/list/${empresa}/${codigoCondicao}?pedido=${numPedido}`;
    const url = entrada ? baseUrl + '&valorentrada=' + entrada : baseUrl;
    return this.http.get(url).pipe(take(1));
  }

  // edit by Helio 27/03/2020, usado para pegar as parcelas
  // getCondicaoPagamentoComEntrada(
  //   codigoCondicao: string,
  //   nuPedido: string,
  //   entrada: number
  // ) {
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
  //   return new Promise((resolve, reject) => {
  //     this.baseService.get(url).then(
  //       (result: any) => {
  //         resolve(result);
  //       },
  //       (error) => {
  //         reject(error);
  //       }
  //     );
  //   });
  // }
}
