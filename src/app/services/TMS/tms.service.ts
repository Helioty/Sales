import { Injectable } from '@angular/core';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from '../http/base.service';

@Injectable({
  providedIn: 'root',
})
export class TMSService {
  constructor(private readonly http: BaseService) {}

  getOpcoesTMS(
    endereco: any,
    qtd: string,
    codigodigitoembalagem: string,
    precolocal: string
  ) {
    let link: string;
    if (endereco.latitude && endereco.longitude) {
      link =
        ENV.WS_TMS +
        API_URL +
        'tms/opcoesfrete/' +
        localStorage.getItem('empresa') +
        '/' +
        codigodigitoembalagem +
        '?qtd=' +
        qtd +
        '&cep=' +
        endereco.ds_cep +
        '&latitude=' +
        endereco.latitude +
        '&longitude=' +
        endereco.longitude +
        '&precolocal=' +
        precolocal;
    } else {
      link =
        ENV.WS_TMS +
        API_URL +
        'tms/opcoesfrete/' +
        localStorage.getItem('empresa') +
        '/' +
        codigodigitoembalagem +
        '?qtd=' +
        qtd +
        '&cep=' +
        endereco.ds_cep +
        '&precolocal=' +
        precolocal;
    }

    return new Promise((resolve, reject) => {
      this.http.get(link).then(
        (result: any) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  gravaOpcoesTMS(
    numPedido: string,
    qtd: string,
    codigodigitoembalagem: string,
    conversao: string
  ) {
    const link =
      ENV.WS_VENDAS +
      API_URL +
      'PedidoVendaItem/' +
      localStorage.getItem('empresa') +
      '/' +
      numPedido +
      '/' +
      codigodigitoembalagem +
      '/gravaopcaofrete?qtd=' +
      qtd +
      '&fator=' +
      conversao;

    //   // atualizando pedido para o tipo entrega // 31/01/2020
    //   await this.atualizarPedidoHearder();
    //   this.opcSelecionada.dataPrevista = null;

    return new Promise((resolve, reject) => {
      this.http.get(link).then(
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
