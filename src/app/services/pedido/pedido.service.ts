import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { Pagination } from 'src/app/page/pedido-lista/pedido-lista.interface';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ClienteGet, Endereco } from './../cliente/cliente.interface';
import { BaseService } from './../http/base.service';
import {
  AttPedido,
  OpcaoParcela,
  PedidoHeader,
  PedidoItem,
  PedidoTable,
} from './pedido.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  public exibeBotaoComprar = false;
  public alteracaoItemPedido = false;

  public condicao: any;

  public statusPedido: string; // controla pedido; 'I' INCLUSÃO , 'M' MANUTENCAO
  // public sistuacaoPedido: string; // controla pedido, A = ABERTO , F = FINALIZADO

  // Verdadeiro se o pedido em manutenção tiver um endereco selecionado.
  public enderecoSelected = false;

  // REMAKE
  // Dados do Pedido.
  private readonly pedido = new BehaviorSubject<PedidoHeader>(null);
  // Tipos de Retirada do Pedido.
  readonly opcoesRetirada = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  public tipoRetiradaIndex: number;
  // Produtos
  private readonly qtdItensSacola = new BehaviorSubject<number>(0);
  private readonly pedidoItens = new BehaviorSubject<PedidoItem[]>([]);
  private readonly produtoPorPagina = 10;
  // Cliente
  private readonly cliente = new BehaviorSubject<ClienteGet>(null);

  constructor(
    private readonly http: BaseService,
    private readonly common: CommonService,
    private readonly clienteService: ClienteService,
    private readonly navControl: NavController
  ) {}

  getPedidoNumero(): number {
    const pedido = this.pedido.getValue();
    return pedido.numpedido;
  }

  getPedidoSequencialEnderecoEntrega(): number {
    const pedido = this.pedido.getValue();
    return pedido.seqEnderecoEntrega;
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

  getPedidoClienteOBS(): Observable<ClienteGet> {
    return this.cliente.asObservable();
  }

  private limpaDadosPedido(): void {
    // Limpando endereco de entrega
    this.enderecoSelected = false;

    this.alteracaoItemPedido = false;

    // REMAKE
    this.pedido.next(null);
    this.qtdItensSacola.next(0);
    this.pedidoItens.next([]);
    this.cliente.next(null);
  }

  /**
   * @author helio.souza
   * @param pedidoHeader Objeto do Pedido.
   */
  private atualizaPedidoHeader(pedidoHeader: PedidoHeader): void {
    // Pedido
    this.pedido.next(pedidoHeader);
    // Pedido - Total Produtos
    this.qtdItensSacola.next(pedidoHeader.numitens);
    // Pedido - Tipo Retirada.
    this.tipoRetiradaIndex = this.opcoesRetirada.findIndex(
      (el) => el === pedidoHeader.tipoEntrega
    );
    console.log('PEDIDO HEADER ATUALIZADO', this.pedido);
  }

  /**
   * @author helio.souza
   * @description Cria um novo pedido.
   */
  criarPedido(): Observable<PedidoHeader> {
    this.limpaDadosPedido();
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
   * @param pedido Objeto do Pedido.
   */
  async reabrirPedido(pedido: PedidoHeader): Promise<void> {
    const toPedidoHome = () => {
      this.navControl.navigateRoot(['/pedido-atalhos']).then(() => {
        this.common.loading.dismiss();
      });
    };
    await this.common.showLoader();
    this.atualizaPedidoHeader(pedido);
    if (pedido.cgccpf_cliente) {
      this.clienteService.getCliente(pedido.cgccpf_cliente, false).subscribe({
        next: (clie) => {
          this.cliente.next(clie);
          toPedidoHome();
        },
        error: () =>
          this.common.showAlertError(
            'Erro!',
            'Falha ao recuperar os dados do Cliente, Tente novamente!'
          ),
      });
    } else {
      toPedidoHome();
    }
  }

  /**
   * @author helio.souza
   * @param idPedido Número do Pedido.
   */
  getPedido(idPedido: string): Observable<PedidoHeader> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/${empresa}/${idPedido}`;
    return this.http.get<PedidoHeader>(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param tableName Campo a ser alterado.
   * @param tableValor Novo dado.
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
   * @param cgccpf CPF/CNPJ do cliente.
   * @param clie Dados do Cliente.
   */
  adicionarCliente(
    numPedido: number,
    cgccpf: string,
    clie: ClienteGet
  ): Observable<PedidoHeader> {
    const aResult = this.atualizaPedido(AttPedido.CLIENTE, cgccpf);
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Cliente Adicionado!');
          this.atualizaPedidoHeader(pedido);
          this.cliente.next(clie);
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
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

  /**
   * @author helio.souza
   * @param action Ação para ser executada ao remover o cliente do pedido.
   */
  confirmaRemoveCliente(action = () => {}): void {
    const handler = async () => {
      await this.common.showLoader();
      const pedido = this.getPedidoNumero();
      this.removerCliente(pedido).subscribe({
        next: () => {
          this.common.loading.dismiss();
          this.cliente.next(null);
          action();
        },
        error: () => this.common.loading.dismiss(),
      });
    };
    const props = {
      titulo: 'Remover cliente?',
      message: 'Deseja remover o cliente do pedido',
      handler,
    };
    this.common.showAlertAction(props);
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param page Pagina a ser retornada.
   * @returns {Observable<Pagination<PedidoItem>>}
   */
  getPedidoItens(numPedido: number, page = 1): Observable<Pagination<PedidoItem>> {
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVendaItem/${empresa}/${numPedido}/itens?page=${page}&size=${this.produtoPorPagina}`;
    return this.http.get<Pagination<PedidoItem>>(url).pipe(take(1));
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @returns {Observable<PedidoItem[]>}
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

  /**
   * @author helio.souza
   * @description Exibe um alert para sair do pedido, se o pedido não conter produtos o mesmo será apagado.
   */
  public sairPedido(): void {
    const mensagem = !this.qtdItensSacola.value
      ? 'Pedidos sem itens serão removidos permanentemente!'
      : '';
    const handler = () => {
      if (!this.qtdItensSacola.value) {
        this.apagarPedido(this.getPedidoNumero()).subscribe({
          next: () => {
            this.limpaDadosPedido();
            this.navControl.navigateRoot('/pedido-lista');
          },
        });
      } else {
        this.limpaDadosPedido();
        this.navControl.navigateRoot('/pedido-lista');
      }
      console.clear();
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

  /**
   * @author helio.souza
   * @param endereco
   * @returns {Observable<PedidoHeader>}
   */
  setEnderecoEntrega(endereco: Endereco): Observable<PedidoHeader> {
    const { sequencialId } = endereco.id;
    const aResult = this.atualizaPedido(AttPedido.SEQ_ENDERECO_ENTREGA, sequencialId);
    const numPedido = this.getPedidoNumero();
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
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
    // this.enderecoSelected = true;
  }

  /**
   * @author helio.souza
   * @returns
   */
  getEnderecoEntrega(): Endereco {
    const sequencial = this.getPedidoSequencialEnderecoEntrega();
    const cliente = this.cliente.getValue();
    const enderecos = cliente.enderecos;
    return enderecos.find((endereco) => endereco.id.sequencialId === sequencial);
  }

  /**
   * @author helio.souza
   * @param tipoPagamento
   * @returns
   */
  setTipoPagamento(tipoPagamento: string): Observable<any> {
    const aResult = this.atualizaPedido(AttPedido.TIPO_PAGAMENTO, tipoPagamento);
    const empresa = localStorage.getItem('empresa');
    const numPedido = this.getPedidoNumero();
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    return this.http.post({ url, body: aResult }).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Tipo Pagamento Atualizado: ', pedido);
          this.atualizaPedidoHeader(pedido);
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @param selected
   * @param valor
   * @returns
   */
  setCondicaoPagamento(selected: OpcaoParcela, valor: any): Observable<any> {
    const pedido = this.pedido.getValue();
    const aResult = this.atualizaPedido(AttPedido.TIPO_PAGAMENTO, pedido.tipodoc);
    if (selected.id) {
      const table1 = this.atualizaPedido(AttPedido.CONDICAO_PAGAMENTO, selected.id);
      aResult.push(table1[0]);
    }
    if (valor) {
      const table2 = this.atualizaPedido(AttPedido.VALOR_ENTRADA, valor.toString());
      aResult.push(table2[0]);
    }
    const empresa = localStorage.getItem('empresa');
    const numPedido = pedido.numpedido;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    console.log('aResult');
    console.log(aResult);
    return this.http.post({ url, body: aResult });
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
