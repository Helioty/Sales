import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { Pagination } from 'src/app/page/pedido-lista/pedido-lista.interface';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { CommonService } from 'src/app/services/common/common.service';
import { BaseService } from './../http/base.service';
import { AttPedido, PedidoHeader, PedidoItem, PedidoTable } from './pedido.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  public tipoConexao: string;
  public exibeBotaoComprar = false;
  public executaPedidoRapido = false;
  public alteracaoItemPedido = false;

  // public noCard = false;
  public valorFrete = 0;

  public condicao: any;

  public statusPedido: string; // controla pedido; 'I' INCLUSÃO , 'M' MANUTENCAO
  // public sistuacaoPedido: string; // controla pedido, A = ABERTO , F = FINALIZADO

  public ItensPedidoAdd: any;
  public nomeCliente = '';

  // PEDIDO EM MANUTENÇÃO
  public tipoDocumento: any;

  // Verdadeiro se o pedido em manutenção tiver um cliente selecionado.
  public clientSelected = false;
  public docCliente = ''; // CPF/CNPJ do cliente do pedido em manutenção.
  public dadosCliente: any = undefined; // Dados do cliente do pedido em manutenção.

  // Verdadeiro se o pedido em manutenção tiver um endereco selecionado.
  public enderecoSelected = false;
  public sequencialEndereco: any = null;

  // REMAKE
  // Dados do Pedido.
  readonly pedido = new BehaviorSubject<PedidoHeader>(null);

  // Tipos de Retirada do Pedido.
  readonly opcoesRetirada = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  public tipoRetiradaIndex: number;

  // Produtos
  readonly qtdItensSacola = new BehaviorSubject<number>(null);
  readonly pedidoItens = new BehaviorSubject<PedidoItem[]>([]);
  // Produtos por Paginação.
  readonly produtoPorPagina = 10;

  constructor(
    private readonly http: BaseService,
    private readonly common: CommonService,
    private readonly clienteService: ClienteService,
    private readonly navControl: NavController
  ) {}

  getPedidoNumero(): number {
    return this.pedido.getValue().numpedido;
  }

  getPedidoAtivo(): Observable<PedidoHeader> {
    return this.pedido.asObservable();
  }

  getTotalItensOBS(): Observable<number> {
    return this.qtdItensSacola.asObservable();
  }

  getPedidoItensOBS(): Observable<PedidoItem[]> {
    return this.pedidoItens.asObservable();
  }

  public limpaDadosPedido(): void {
    // Limpando cliente do pedido
    this.clientSelected = false;
    this.docCliente = '';
    this.dadosCliente = undefined;

    // Limpando endereco de entrega
    this.enderecoSelected = false;
    this.sequencialEndereco = null;

    this.valorFrete = 0;

    this.alteracaoItemPedido = false;
    // this.sistuacaoPedido = 'N';
    this.tipoDocumento = '';
    this.statusPedido = '';
    this.docCliente = '';
    this.nomeCliente = '';

    // REMAKE
    this.pedido.next(null);
    this.qtdItensSacola.next(null);
    this.pedidoItens.next([]);
  }

  // by Helio 20/03/2020
  public atualizaPedidoHeader(pedidoHeader: PedidoHeader): void {
    // Pedido
    this.pedido.next(pedidoHeader);
    // Produtos
    this.qtdItensSacola.next(pedidoHeader.numitens);
    // Pedido - Tipo Retirada.
    this.tipoRetiradaIndex = this.opcoesRetirada.findIndex(
      (el) => el === pedidoHeader.tipoEntrega
    );
    console.log('PEDIDO HEADER ATUALIZADO', this.pedido);
  }

  /**
   * @author helio.souza
   */
  criarPedido(): Observable<PedidoHeader> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/${empresa}/criar`;
    return this.http.post<PedidoHeader, any>({ url, body: {} }).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Pedido criado!');
          this.atualizaPedidoHeader(pedido);
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @param idPedido
   * @returns
   */
  getPedido(idPedido: string): Observable<PedidoHeader> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/${empresa}/${idPedido}`;
    return this.http.get<PedidoHeader>(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param tableName
   * @param tableValor
   * @returns
   */
  private atualizaPedido(tableName: AttPedido, tableValor: any): PedidoTable[] {
    const aResult: PedidoTable[] = [];
    const table = new PedidoTable();
    table.name = tableName;
    table.value = tableValor;
    aResult.push(table);
    return aResult;
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param retiradaIdx Index de retirada.
   * @returns
   */
  alterarTipoRetirada(numPedido: number, retiradaIdx: number): Observable<PedidoHeader> {
    const aResult = this.atualizaPedido(
      AttPedido.TIPO_ENTREGA,
      this.opcoesRetirada[retiradaIdx]
    );
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log(`Tipo Entraga Atualizado: ${this.opcoesRetirada[retiradaIdx]}`);
          this.atualizaPedidoHeader(pedido);
          this.tipoRetiradaIndex = retiradaIdx;
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param codCard Codigo escaneado do Cartão Pedido.
   * @returns
   */
  setCardPedido(numPedido: number, codCard: string): Observable<PedidoHeader> {
    const aResult = this.atualizaPedido(AttPedido.CARTAO_PEDIDO, codCard);
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Set Catão: ', codCard);
          this.atualizaPedidoHeader(pedido);
          this.common.showToast('Cartão Pedido Adicionado!');
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @description Atualiza o cartão pedido.
   */
  adicionarCartaoPedido(): void {
    const handler = (data: any) => {
      this.setCardPedido(this.getPedidoNumero(), data.codigo).subscribe();
    };
    const props = { titulo: 'Cartão Pedido', message: '', handler };
    const inputs = [
      {
        name: 'codigo',
        type: 'text',
        placeholder: 'Digite o codigo do cartão!',
      },
    ];
    const options = {
      allowClose: true,
      showCancel: true,
      cssClasses: ['ion-alert-input'],
      inputs,
    };
    this.common.showAlertAction(props, options);
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param cgccpf
   * @param clienteData
   * @returns
   */
  adicionarCliente(
    numPedido: number,
    cgccpf: string,
    clienteData: any
  ): Observable<PedidoHeader> {
    const aResult = this.atualizaPedido(AttPedido.CLIENTE, cgccpf);
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Cliente atualizado: ', pedido);
          this.atualizaPedidoHeader(pedido);
        },
      })
    );
    // this.dadosCliente = dadosCli;
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @returns
   */
  removerCliente(numPedido: number): Observable<PedidoHeader> {
    const aResult = this.atualizaPedido(AttPedido.CLIENTE, '');
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Cliente Removido! ', pedido);
          this.atualizaPedidoHeader(pedido);
        },
      })
    );
  }

  // by Hélio - Retorna os dados do cliente selecionado
  public async retornaDadosCliente() {
    // if (
    //   this.clientSelected &&
    //   this.docCliente !== '' &&
    //   this.dadosCliente === undefined
    // ) {
    //   await this.common.showLoader();
    //   await this.clienteService.getClienteNoAlert(this.docCliente).then(
    //     (result: any) => {
    //       this.dadosCliente = result;
    //       this.common.loading.dismiss();
    //       return;
    //     },
    //     () => {
    //       this.common.loading.dismiss();
    //     }
    //   );
    // } else {
    //   return;
    // }
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param page Pagina a ser retornada.
   * @returns
   */
  getPedidoItens(numPedido: number, page = 1): Observable<Pagination<PedidoItem>> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVendaItem/${empresa}/${numPedido}/itens?page=${page}&size=${this.produtoPorPagina}`;
    return this.http.get<Pagination<PedidoItem>>(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @returns
   */
  getPedidoAllItens(numPedido: number): Observable<PedidoItem[]> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVendaItem/${empresa}/${numPedido}/itens`;
    return this.http.get<Pagination<PedidoItem>>(url).pipe(
      take(1),
      tap({
        next: (paginationIt) => {
          this.atualizaPedidoItems(paginationIt);
        },
      }),
      map((it) => it.content)
    );
  }

  adicionarItemPedido(): Observable<any> {
    return this.http.post({} as any).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param pedidoItem
   * @returns
   */
  adicionarItemPedidoRapido(pedidoItem: PedidoItem): Observable<PedidoItem[]> {
    const empresa = localStorage.getItem('empresa');
    const pedido = this.getPedidoNumero();
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVendaItem/${empresa}/${pedido}/addfast`;
    return this.http
      .post<{ items: Pagination<PedidoItem>; pedido: PedidoHeader }, PedidoItem>({
        url,
        body: pedidoItem,
      })
      .pipe(
        take(1),
        tap({
          next: (response) => {
            this.atualizaPedidoItems(response.items);
            this.atualizaPedidoHeader(response.pedido);
          },
        }),
        map((response) => response.items.content)
      );
  }

  /**
   * @author helio.souza
   * @param paginationIt
   */
  atualizaPedidoItems(paginationIt: Pagination<PedidoItem>): void {
    console.log('Pedido Itens Att: ', paginationIt.content);
    this.pedidoItens.next(paginationIt.content);
    this.qtdItensSacola.next(paginationIt.totalElements);
  }

  /**
   * @author helio.souza
   * @param codigoProduto Codigo do produto a ser removido do pedido.
   * @returns
   */
  removeItemPedido(codigoProduto: string): Observable<any> {
    const empresa = localStorage.getItem('empresa');
    const pedido = this.getPedidoNumero();
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVendaItem/${empresa}/${pedido}/${codigoProduto}`;
    return this.http.post<any, any>({ url, body: {} }).pipe(
      take(1),
      tap({
        next: (a) => {
          this.common.showToast(a.msg);
          console.log('Remove Produto Response: ', a.msg);
        },
      })
    );
  }

  // by Hélio 12/02/2020
  public sairPedido(): void {
    const mensagem = this.qtdItensSacola.value
      ? 'Pedidos sem itens serão removidos permanentemente!'
      : '';
    const handler = () => {
      if (this.qtdItensSacola.value) {
        this.apagarPedido(this.getPedidoNumero()).subscribe({
          next: () => {
            this.limpaDadosPedido();
            this.navControl.navigateRoot('/pedido-lista');
            console.clear();
          },
        });
      } else {
        this.limpaDadosPedido();
        this.navControl.navigateRoot('/pedido-lista');
        console.clear();
      }
    };
    const props = {
      titulo: 'Deseja realmente sair do pedido?',
      message: mensagem,
      handler,
    };
    this.common.showAlertAction(props);
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido a ser apagado.
   * @returns
   */
  apagarPedido(numPedido: number): Observable<any> {
    const empresa = localStorage.getItem('empresa');
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/${empresa}/${numPedido}`;
    const props = { url, body: {} };
    return this.http.post<any, any>(props).pipe(
      take(1),
      tap({
        next: () => console.log('Pedido Apagado!'),
      })
    );
  }

  // by Helio 15/07/2020
  selecionaEndereco(endereco: any): Observable<PedidoHeader> {
    const aResult = this.atualizaPedido(
      AttPedido.SEQ_ENDERECO_ENTREGA,
      endereco.id.sequencialId
    );
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${endereco}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Endereço atualizado: ', pedido);
          this.atualizaPedidoHeader(pedido);
        },
      })
    );
    // await this.baseService.post(link, aResult).then(
    //     this.atualizaPedidoHeader(result);
    //     this.enderecoSelected = true;
    //     this.sequencialEndereco = this.pedidoHeader.seqEnderecoEntrega;
  }

  // abrindo pagina customizada utilizando parametros
  openCustomPage(P: string, PS: string, PA: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: PS,
        paginaAnterior: PA,
      },
    };
    this.navControl.navigateForward(['/' + P], navigationExtras);
  }

  goToFinalizacao(paginaAtual: string) {
    // checa se é necessario informar o cliente
    // if (this.pedidoHeader.informarCliente === 'S') {
    //   if (
    //     !this.clientSelected &&
    //     (this.pedidoHeader.cgccpf_cliente === '' ||
    //       this.pedidoHeader.cgccpf_cliente === null)
    //   ) {
    //     console.log('Cliente obrigatorio!');
    //     this.openCustomPage('cliente', 'finalizaService', paginaAtual);
    //     return;
    //   }
    // }
    // // checa o tipo de entrega do pedido
    // if (this.pedidoHeader.tipoEntrega === 'ENTREGA') {
    //   console.log('Pedido do tipo ENTREGA!');
    //   const tms = localStorage.getItem('tms');
    //   // checa se o TMS está ativo na filial baseado na informações retornada no login
    //   if (tms === 'true') {
    //     console.log('TMS ativo!');
    //     this.openCustomPage('endereco-entrega', 'finalizaService', paginaAtual);
    //     return;
    //   } else {
    //     console.log('TMS inativo!');
    //     this.openCustomPage('endereco-entrega-old', 'finalizaService', paginaAtual);
    //     return;
    //   }
    // } else {
    //   this.openCustomPage('formas-pagamento', 'finalizaService', paginaAtual);
    //   return;
    // }
  }
}
