import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
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
   * @returns
   */
  public getCliente(doc: string): Observable<ClienteGet> {
    const url = `${ENV.WS_CRM}${API_URL}cliente/${doc}`;
    return this.http
      .get<ClienteGet>(url)
      .pipe(take(1), tap({ next: (clie) => console.log('Cliente: ', clie) }));
  }

  // by Helio 20/03/2020, usado para pegar as informações do cliente apos reabrir o pedido
  public getClienteNoAlert(doc: string) {
    const link = ENV.WS_CRM + API_URL + 'cliente/' + doc;

    // return new Promise((resolve, reject) => {
    //   this.baseService.getNoShowError(link).then(
    //     (result: any) => {
    //       resolve(result);
    //     },
    //     (error) => {
    //       reject(error);
    //     }
    //   );
    // });
  }

  // by Helio 23/03/2020, usado para cadastrar um novo endereco
  public postClienteAlteracao(cliente: any): Observable<any> {
    // const link = ENV.WS_CRM + API_URL + 'cliente/save/';
    const url = `${ENV.WS_CRM}${API_URL}cliente/save`;

    // return new Promise((resolve, reject) => {
    //   this.baseService.post(link, cliente).then(
    //     (result: any) => {
    //       resolve(result);
    //     },
    //     (error) => {
    //       reject(error);
    //     }
    //   );
    // });
    const props = { url, body: cliente };
    return this.http.post(props).pipe(take(1));
  }
}
