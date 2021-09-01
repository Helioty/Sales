import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { Pagination } from 'src/app/page/pedido-lista/pedido-lista.interface';
import { BaseService } from './../http/base.service';
import { IProduto, IProdutoFamilia, IProdutoImagem } from './produto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  readonly produtosPorPagina = 20;
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
   * @description Retorna produto usando o codigo. Serviço JAVA.
   * @param codigo - Codigo do produto.
   * @param page Pagina a ser retornada.
   * @return Objeto do Produto formatado.
   */
  getProdutoPagination(codigo: string, page = 1): Observable<Pagination<IProduto>> {
    const empresa = localStorage.getItem('empresa') as string;
    const filter = Number(codigo) ? '' : 'descricao:';
    const link = `${ENV.WS_PRODUTO}${API_URL}list/${empresa}?filter=${filter}${codigo}&page=${page}&size=${this.produtosPorPagina}`;
    return this.http.get<Pagination<any>>(link).pipe(
      map((result) => {
        result.content = this.formataProdutos(result.content);
        return result as Pagination<IProduto>;
      })
    );
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

  /**
   * @author helio.souza
   * @param produtoCodigoDigito Codigo do Produto com Digito.
   * @returns {Observable<IProdutoImagem[]>}
   */
  getAllListImage(produtoCodigoDigito: string): Observable<IProdutoImagem[]> {
    const url = `${ENV.WS_PRODUTO}${API_URL}listImages/${produtoCodigoDigito}`;
    return this.http.get(url);
  }

  /**
   * @author helio.souza
   * @param produtoCodigoDigito Codigo do Produto com Digito.
   * @returns {Observable<IProdutoImagem>}
   */
  getFirstImage(produtoCodigoDigito: string): Observable<IProdutoImagem> {
    const url = `${ENV.WS_PRODUTO}${API_URL}listImages/${produtoCodigoDigito}/1`;
    return this.http.get<IProdutoImagem[]>(url).pipe(map((imagens) => imagens[0]));
  }

  // edit by Helio 19/03/2020
  getProductInfomation(produtoCodigoDigitoEmbalagem: string): Observable<any> {
    const url = `${ENV.WS_PRODUTO}${API_URL}detalhe/${produtoCodigoDigitoEmbalagem}`;
    return this.http.get(url).pipe(
      tap({
        next: (info) => {
          console.log('Info: ', info);
        },
      })
    );
  }

  // edit by Helio 20/05/2020
  public getFamilia(codigoProduto: string): Observable<IProdutoFamilia[]> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_PRODUTO}${API_URL}familia/${empresa}/${codigoProduto}`;
    return this.http.get(url);
  }

  // edit by Helio 29/05/2020
  public getDeposito(codigoProduto: string, codigoPedido: string) {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_PRODUTO}${API_URL}estoque/${empresa}/${codigoProduto}?pedido=${codigoPedido}`;
    return this.http.get(url);
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
