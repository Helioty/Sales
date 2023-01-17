import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { Pagination } from 'src/app/page/pedido-lista/pedido-lista.interface';
import { BaseService } from '../http/base.service';
import { ClienteGet } from './cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  readonly clientesPorPagina = 10;
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @description Pega as informações do cliente via CPF/CNPJ.
   * @param doc CPF/CNPJ do cliente.
   * @param showError Controla o alert de erro da requisição.
   */
  getCliente(doc: string, showError = true): Observable<ClienteGet> {
    const url = `${ENV.WS_CRM}${API_URL}cliente/${doc}`;
    const options = { token: true, showError, retry: 0 };
    return this.http.get<ClienteGet>(url, options).pipe(
      take(1),
      tap({ next: (clie: ClienteGet) => console.log('Cliente: ', clie) }),
      catchError((err) => {
        if (!showError && err.status !== 404) {
          this.http.showError(err);
        }
        throw err;
      })
    );
  }

  /**
   * @author helio.souza
   * @param clie Dado a ser pesquisado.
   * @param page Pagina requerida. Default: 1
   */
  getClientePesquisa(clie: string, page = 1): Observable<Pagination<ClienteGet>> {
    const url = `${ENV.WS_CRM}${API_URL}cliente/list?search=${clie}&page=${page}&size=${this.clientesPorPagina}`;
    return this.http.get(url);
  }

  /**
   * @author helio.souza
   * @param cliente Dados do cliente.
   */
  postClienteAlteracao(cliente: ClienteGet): Observable<ClienteGet> {
    const url = `${ENV.WS_CRM}${API_URL}cliente/save`;
    const props = { url, body: cliente };
    return this.http.post<ClienteGet, ClienteGet>(props).pipe(take(1));
  }
}
