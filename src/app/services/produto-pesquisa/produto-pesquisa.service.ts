import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { BaseService } from '../HTTP/base-service.service';
import { API_URL } from './../../config/app.config.service';
import { PesquisaObejct } from './Ipesquisa-produto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutoPesquisaService {

  constructor(
    private baseService: BaseService
  ) { }

  public getPesquisaDetalhada(objeto: PesquisaObejct) {
    const link = ENV.WS_PESQUISA + API_URL + 'api/pesquisa/getPesquisaDetalhada/' +
      objeto.codEmpresa + '&' + objeto.codigo + '&' + objeto.descricao + '&' + objeto.fornecedor + '&' +
      objeto.modelo + '&' + objeto.linha + '&' + objeto.p1 + '&' + objeto.p2 + '&' + objeto.soComEstoque;
    console.log(link);

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }


}
