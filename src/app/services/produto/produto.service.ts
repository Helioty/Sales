import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { CommonService } from 'src/app/services/common/common.service';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    private baseService: BaseService,
    private common: CommonService,
  ) { }


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
      this.baseService.get(link).then((result: any) => {
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

}
