import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from './../http/base.service';
import { IProduto } from './produto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private readonly http: BaseService) {}

  /**
   * @author helio.souza
   * @description Retorna produto usando o codigo. Serviço JAVA.
   * @param codigo - Codigo do produto.
   * @return Objeto do Produto formatado.
   */
  getProdutoByCodigo(codigo: string): Observable<IProduto[]> {
    const empresa = localStorage.getItem('empresa') as string;
    const link = `${ENV.WS_PRODUTO}${API_URL}list/${empresa}?filter=${codigo}`;
    return this.http
      .get<any>(link)
      .pipe(map((result) => this.formataProdutos(result.content)));
  }

  /**
   * @author helio.souza
   * @description Retorna objetos de produtos formatados.
   * @param produtos Objetos do serviço JAVA.
   * @returns Produtos formatados.
   */
  formataProdutos(produtos: any[]): IProduto[] {
    return produtos.map((produto) => {
      return {
        avariadoStatus: produto.avariadoStatus,
        cgcFornecedor: produto.cgc_fornecedor,
        codProduto: produto.cod_produto,
        codbarean13: produto.codbarean13,
        codigo: produto.codigo,
        codigoBase: produto.codigoBase,
        codigoFC: produto.codigoFC,
        codigoForn: produto.codigoForn,
        codigoFornecedorBase: produto.codigoFornecedorBase,
        codigodigito: produto.codigodigito,
        codigodigitoembalagem: produto.codigodigitoembalagem,
        conversao: produto.conversao,
        desconto: produto.desconto,
        descricao: produto.descricao,
        descricaoForn: produto.descricaoForn,
        descricaoProd: produto.descricao_prod,
        descricaoSituacao: produto.descricao_situacao,
        estoque: produto.estoque,
        fantas: produto.fantas,
        formaParcelamento: produto.formaParcelamento,
        imagem: produto.imagem,
        inalante: produto.inalante,
        isProdutoBase: produto.isProdutoBase,
        linha: produto.linha,
        link: produto.link,
        precoPorUnidade: produto.precoPorUnidade,
        precoSemDesconto: produto.precoSemDesconto,
        prvd1: produto.prvd1,
        qtdDecimal: produto.qtdDecimal,
        qtdMaxParcelas: produto.qtdMaxParcelas,
        qtdMinima: produto.qtdMinima,
        qtdImagens: produto.qtd_imagens,
        qtdpages: produto.qtdpages,
        situacao: produto.situacao,
        totalElements: produto.totalElements,
        unidade: produto.unidade,
        valorParcela: produto.valorParcela,
      } as IProduto;
    });
  }

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
    // const link = ENV.WS_PRODUTO + API_URL + 'listImages/' + codigo + '/1';
    const url = `${ENV.WS_PRODUTO}${API_URL}listImages/${codigo}/1`;
    return this.http.get(url);
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
