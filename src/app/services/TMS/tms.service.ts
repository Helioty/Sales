import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { Endereco } from '../cliente/cliente.interface';
import { BaseService } from '../http/base.service';

@Injectable({
  providedIn: 'root',
})
export class TMSService {
  constructor(private readonly http: BaseService) {}

  getOpcoesTMS(
    endereco: Endereco,
    qtd: string,
    codigodigitoembalagem: string,
    precolocal: 'S' | 'N'
  ): Observable<any> {
    const empresa = localStorage.getItem('empresa');
    const baseUrl = `${ENV.WS_TMS}${API_URL}tms/opcoesfrete/${empresa}/${codigodigitoembalagem}?qtd=${qtd}&cep=${endereco.ds_cep}&precolocal=${precolocal}`;
    const url =
      endereco.latitude && endereco.longitude
        ? `${baseUrl}&latitude=${endereco.latitude}&longitude=${endereco.longitude}`
        : `${baseUrl}`;
    return this.http.get(url).pipe(take(1));
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
      this.http.get(link).subscribe(
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
