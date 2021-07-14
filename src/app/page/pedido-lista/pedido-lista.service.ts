import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from 'src/app/services/http/base.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { Pagination } from './pedido-lista.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoListaService {
  readonly pedidosPorPagina = 5;
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @param fill Estado dos pedidos a serem retornados.
   * @param page Pagina a ser retornada.
   * @returns
   */
  getPedidos(
    fill: 'abertos' | 'faturados',
    page = 1
  ): Observable<Pagination<PedidoHeader>> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/list/${empresa}/${fill}?page=${page}&size=${this.pedidosPorPagina}`;
    return this.http.get<Pagination<PedidoHeader>>(url).pipe(take(1));
  }
}
