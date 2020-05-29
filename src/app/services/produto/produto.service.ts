import { Injectable } from '@angular/core';
import { BaseService } from '../HTTP/base-service.service';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private baseService: BaseService) { }

  // by Ryuge 18/09/2018
  // edit by Helio 19/03/2020
  public getAllListImage(codigo: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'listImages/' + codigo;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // by Ryuge 18/09/2018
  // edit by Helio 22/05/2020
  public getFirstImage(codigo: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'listImages/' + codigo + '/1';

    return new Promise((resolve, reject) => {
      this.baseService.getNoShowError(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // edit by Helio 19/03/2020
  public getProductInfomation(codigoProduto: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'detalhe/' + codigoProduto;

    return new Promise((resolve, reject) => {
      this.baseService.getNoShowError(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // edit by Helio 20/05/2020
  public getFamilia(codigoProduto: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'familia/' + localStorage.getItem('empresa') + '/' + codigoProduto;

    return new Promise((resolve, reject) => {
      this.baseService.getNoShowError(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  // edit by Helio 29/05/2020
  public getDeposito(codigoProduto: string, codigoPedido: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'estoque/' + localStorage.getItem('empresa') + '/' + codigoProduto + '?pedido=' + codigoPedido;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }


  // Chamadas em JAVA ----------------------------------------------------------------------------------------------------------------------------

  // edit by Helio 29/05/2020
  public getProduto(codigo: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'list/' + localStorage.getItem('empresa') + '?filter=' + codigo;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }


}
