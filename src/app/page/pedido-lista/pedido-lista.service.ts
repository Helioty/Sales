import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from 'src/app/services/http/base.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { Pagination } from './pedido-lista.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoListaService {
  readonly totalPorPagina = 5;
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @param page Pagina a ser retornada.
   * @returns
   */
  getPedidosEmAberto(page = 1): Observable<Pagination<PedidoHeader>> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/list/${empresa}/abertos?page=${page}&size=${this.totalPorPagina}`;
    return this.http.get(url);
  }

  /**
   * @author helio.souza
   * @param page Pagina a ser retornada.
   * @returns
   */
  getPedidosFinalizados(page = 1): Observable<Pagination<PedidoHeader>> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/list/${empresa}/faturados?page=${page}&size=${this.totalPorPagina}`;
    return this.http.get(url);
  }
}
