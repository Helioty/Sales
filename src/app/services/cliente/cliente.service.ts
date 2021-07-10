import { Injectable } from '@angular/core';
import { BaseService } from '../http/base.service';
import { API_URL, ENV } from 'src/app/config/app.config.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private http: BaseService) {}

  // edit by Helio 20/03/2020, pega as informações do cliente via CPF/CNPJ
  public getCliente(doc: string) {
    const link = ENV.WS_CRM + API_URL + 'cliente/' + doc;

    // return new Promise((resolve, reject) => {
    //   this.baseService.get(link).then(
    //     (result: any) => {
    //       resolve(result);
    //     },
    //     (error) => {
    //       reject(error);
    //     }
    //   );
    // });
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
  public postClienteAlteracao(cliente: any) {
    const link = ENV.WS_CRM + API_URL + 'cliente/save/';

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
  }
}
