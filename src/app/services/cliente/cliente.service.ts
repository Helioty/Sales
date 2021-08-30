import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from '../http/base.service';
import { ClienteGet } from './cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @description Pega as informações do cliente via CPF/CNPJ.
   * @param doc CPF/CNPJ do cliente.
   * @param showError Controla o alert de erro da requisição.
   */
  public getCliente(doc: string, showError = true): Observable<ClienteGet> {
    const url = `${ENV.WS_CRM}${API_URL}cliente/${doc}`;
    const options = { token: true, showError };
    return this.http.get<ClienteGet>(url, options).pipe(
      take(1),
      tap({ next: (clie) => console.log('Cliente: ', clie) }),
      catchError((err) => {
        if (!showError && err.status !== 404) {
          this.http.showError(err);
        }
        throw err;
      })
    );
  }

  // by Helio 23/03/2020, usado para cadastrar um novo endereco
  public postClienteAlteracao(cliente: any): Observable<any> {
    // const link = ENV.WS_CRM + API_URL + 'cliente/save/';
    const url = `${ENV.WS_CRM}${API_URL}cliente/save`;

    // return new Promise((resolve, reject) => {
    //   this.baseService.post(link, cliente).then(
    //     (result: any) => {
    //       resolve(result);
    //     }
    //   );
    // });
    const props = { url, body: cliente };
    return this.http.post(props).pipe(take(1));
  }
}
