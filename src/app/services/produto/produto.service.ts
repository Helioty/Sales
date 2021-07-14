import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from './../http/base.service';
import { API_URL, ENV } from 'src/app/config/app.config.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private readonly http: BaseService) {}

  // by Ryuge 18/09/2018
  // edit by Helio 19/03/2020
  public getAllListImage(codigo: string): Observable<any> {
    // const link = ENV.WS_PRODUTO + API_URL + 'listImages/' + codigo;
    const url = `${ENV.WS_PRODUTO}${API_URL}listImages/${codigo}`;
    return this.http.get(url);
  }

  // by Ryuge 18/09/2018
  // edit by Helio 22/05/2020
  public getFirstImage(codigo: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'listImages/' + codigo + '/1';

    return new Promise((resolve, reject) => {
      this.http
        .get(link)
        .toPromise()
        .then(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // edit by Helio 19/03/2020
  public getProductInfomation(codigoProduto: string) {
    const link = ENV.WS_PRODUTO + API_URL + 'detalhe/' + codigoProduto;

    return new Promise((resolve, reject) => {
      this.http
        .get(link)
        .toPromise()
        .then(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // edit by Helio 20/05/2020
  public getFamilia(codigoProduto: string) {
    const link =
      ENV.WS_PRODUTO +
      API_URL +
      'familia/' +
      localStorage.getItem('empresa') +
      '/' +
      codigoProduto;

    return new Promise((resolve, reject) => {
      this.http
        .get(link)
        .toPromise()
        .then(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // edit by Helio 29/05/2020
  public getDeposito(codigoProduto: string, codigoPedido: string) {
    const link =
      ENV.WS_PRODUTO +
      API_URL +
      'estoque/' +
      localStorage.getItem('empresa') +
      '/' +
      codigoProduto +
      '?pedido=' +
      codigoPedido;

    return new Promise((resolve, reject) => {
      this.http
        .get(link)
        .toPromise()
        .then(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // edit by Helio 29/05/2020
  public getProduto(codigo: string) {
    const link =
      ENV.WS_PRODUTO +
      API_URL +
      'list/' +
      localStorage.getItem('empresa') +
      '?filter=' +
      codigo;

    return new Promise((resolve, reject) => {
      this.http
        .get(link)
        .toPromise()
        .then(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // edit by Helio 01/06/2020
  public addProdutoSacola(codigo: string) {
    const link =
      ENV.WS_PRODUTO +
      API_URL +
      'list/' +
      localStorage.getItem('empresa') +
      '?filter=' +
      codigo;

    return new Promise((resolve, reject) => {
      this.http
        .get(link)
        .toPromise()
        .then(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}
