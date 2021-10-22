import { BaseService } from 'src/app/services/http/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoDesconto } from 'src/app/services/pedido/pedido.interface';
import { take } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';

@Injectable({
  providedIn: 'root',
})
export class DescontoService {
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   */
  getDescontoPedido(numPedido: number): Observable<PedidoDesconto[]> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/descontoInfo/${empresa}/${numPedido}`;
    return this.http.get<PedidoDesconto[]>(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param usuario Usuário que deseja dar o desconto.
   */
  getDescontoMargin(usuario: number): Observable<any> {
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/showMargens?login=${usuario}`;
    return this.http.get(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param usuario Usuário que deu o desconto.
   * @param desconto Valor do desconto.
   */
  setDescontoPedido(
    numPedido: number,
    usuario: string,
    desconto: number
  ): Observable<any> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/aplicarDesconto/${empresa}/${numPedido}?login=${usuario}&desconto=${desconto}`;
    return this.http.post<any, any>({ url, body: {} }).pipe(take(1));
  }
}
