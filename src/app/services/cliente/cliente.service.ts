import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from '../base-service.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private pedidoService: PedidoService,
    private common: CommonService,
    private navControl: NavController
  ) { }


  // edit by Helio 20/03/2020, pega as informações do cliente via CPF/CNPJ
  public getCliente(doc: string) {
    const link = ENV.WS_CRM + API_URL + 'cliente/' + doc;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // by Helio 20/03/2020, usado para pegar as informações do cliente apos reabrir o pedido
  public getClienteNoAlert(doc: string) {
    const link = ENV.WS_CRM + API_URL + 'cliente/' + doc;

    return new Promise((resolve, reject) => {
      this.baseService.getNoShowError(link).then((result: any) => {
        this.pedidoService.dadosCliente = result;
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // by Helio 23/03/2020, usado para cadastrar um novo endereco
  public postClienteAlteracao(cliente: any) {
    const link = ENV.WS_CRM + API_URL + 'cliente/save/';

    return new Promise((resolve, reject) => {
      this.baseService.post(link, cliente).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

}
