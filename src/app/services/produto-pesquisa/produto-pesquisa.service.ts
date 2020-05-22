import { Injectable } from '@angular/core';
import { BaseService } from './../base-service.service';
import { API_URL } from './../../config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoPesquisaService {

  constructor(
    private baseService: BaseService
  ) { }

  public getPesquisaDetalhada({ codEmpresa, codigo, descricao, fornecedor, modelo, linha, p1, p2, soComEstoque }: { codEmpresa: string; codigo: number; descricao: string; fornecedor: string; modelo: string; linha: string; p1: number; p2: number; soComEstoque: boolean; }) {
    const link = ENV.WS_PESQUISA + API_URL + "api/pesquisa/getPesquisaDetalhada/" + codEmpresa + "&" + codigo + "&" + descricao + "&" + fornecedor + "&" + modelo + "&" + linha + "&" + p1 + "&" + p2 + "&" + soComEstoque;
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
