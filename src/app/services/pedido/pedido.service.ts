import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { CommonService } from 'src/app/services/common/common.service';
import { BaseService } from './../http/base.service';
import { PedidoHeader, PedidoTable } from './pedido.interface';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  public tipoConexao: string;
  public exibeBotaoComprar = false;
  public executaPedidoRapido = false;
  public alteracaoItemPedido = false;

  public noCard = false;
  public valorFrete = 0;

  public condicao: any;

  public statusPedido: string; // controla pedido; 'I' INCLUSÃO , 'M' MANUTENCAO
  // public sistuacaoPedido: string; // controla pedido, A = ABERTO , F = FINALIZADO

  public ItensPedidoAdd: any;
  public nomeCliente = '';

  // PEDIDO EM MANUTENÇÃO
  public pedidoHeader = new PedidoHeader(); // Todos os principais dados do pedido em manutenção.
  public numPedido = '0'; // Numero do pedido em manutenção.
  public digitoPedido: number;
  // public tipoRetirada: string; // Tipo de retirada do pedido em manutenção.
  public tipoDocumento: any;
  public qtdItensSacola = 0; // Quantidade de itens do pedido em manutenção.

  // Verdadeiro se o pedido em manutenção tiver um cliente selecionado.
  public clientSelected = false;
  public docCliente = ''; // CPF/CNPJ do cliente do pedido em manutenção.
  public dadosCliente: any = undefined; // Dados do cliente do pedido em manutenção.

  // Verdadeiro se o pedido em manutenção tiver um cartão-pedido selecionado.
  public cardSelected = false;
  public codigoCartaoPedido = ''; // Codido do cartão-pedido do pedido em manutenção.

  // Verdadeiro se o pedido em manutenção tiver um endereco selecionado.
  public enderecoSelected = false;
  public sequencialEndereco: any = null;

  // REMAKE
  // Dados do Pedido.
  readonly pedido = new BehaviorSubject<PedidoHeader>(null);

  // Tipos de Retirada do Pedido.
  readonly opcoesRetirada = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  public tipoRetiradaIndex: number;

  constructor(
    private readonly http: BaseService,
    private readonly common: CommonService,
    private clienteService: ClienteService,
    private navControl: NavController
  ) {
    // this.pedido = new BehaviorSubject({} as PedidoHeader);
  }

  public limpaDadosPedido() {
    this.pedidoHeader = new PedidoHeader();
    this.numPedido = '0';

    // Limpando cliente do pedido
    this.clientSelected = false;
    this.docCliente = '';
    this.dadosCliente = undefined;

    // Limpando cartão do pedido
    this.cardSelected = false;
    this.codigoCartaoPedido = '';

    // Limpando endereco de entrega
    this.enderecoSelected = false;
    this.sequencialEndereco = null;

    this.valorFrete = 0;

    this.alteracaoItemPedido = false;
    this.digitoPedido = 0;
    // this.sistuacaoPedido = 'N';
    this.tipoDocumento = '';
    this.qtdItensSacola = 0;
    this.statusPedido = '';
    this.docCliente = '';
    this.nomeCliente = '';
  }

  // by Helio 20/03/2020
  public atualizaPedidoHeader(pedidoHeader: PedidoHeader) {
    this.pedido.next(pedidoHeader);
    this.pedidoHeader = pedidoHeader;
    this.numPedido = pedidoHeader.numpedido.toString();
    this.digitoPedido = pedidoHeader.digito;

    // this.tipoRetirada = pedidoHeader.tipoEntrega;
    switch (pedidoHeader.tipoEntrega) {
      case 'IMEDIATA':
        this.tipoRetiradaIndex = 0;
        break;
      case 'POSTERIOR':
        this.tipoRetiradaIndex = 1;
        break;
      case 'ENTREGA':
        this.tipoRetiradaIndex = 2;
        break;

      default:
        break;
    }

    this.qtdItensSacola = pedidoHeader.numitens;

    console.log('PEDIDO HEADER ATUALIZADO');
    console.log(this.pedidoHeader);
  }

  /**
   * @author helio.souza
   */
  criarPedido(): Observable<PedidoHeader> {
    const empresa = localStorage.getItem('empresa');
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

  // edit by Helio 10/03/2020
  public async getPedido(idPedido: string) {
    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVenda/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   idPedido;
    // return new Promise((resolve, reject) => {
    //   this.baseService.get(link).then(
    //     (result: any) => {
    //       resolve(result);
    //     },
    //     (error) => {
    //       console.log(error);
    //       reject(error);
    //     }
    //   );
    // });
  }

  // by Hélio 06/02/2020
  private atualizaPedido(tableName: string, tableValor: any): PedidoTable[] {
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
  alterarTipoRetirada(numPedido: number, retiradaIdx: number): Observable<any> {
    const aResult = this.atualizaPedido('entrega', this.opcoesRetirada[retiradaIdx]);
    const empresa = localStorage.getItem('empresa') as string;
    const url = `${ENV.WS_VENDAS}${API_URL}PedidoVenda/update/${empresa}/${numPedido}`;
    const props = { url, body: aResult };
    return this.http.post<PedidoHeader, PedidoTable[]>(props).pipe(
      take(1),
      tap({
        next: (pedido) => {
          console.log('Pedido: ', pedido);
          this.tipoRetiradaIndex = retiradaIdx;
        },
      })
    );
  }

  // alterado por Nicollas Bastos em 25/09/2018
  // alterado por Hélio 06/02/2020
  public async setCardPedido(codCard: string) {
    const aResult: any = await this.atualizaPedido('cartao_pedido', codCard);

    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVenda/update/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.numPedido;

    // await this.baseService.post(link, aResult).then(
    //   (result: any) => {
    //     this.atualizaPedidoHeader(result);
    //     this.cardSelected = true;
    //     this.codigoCartaoPedido = codCard;
    //     this.common.showToast('Cartão Pedido Adicionado!');
    //   },
    //   (error: any) => {
    //     this.cardSelected = false;
    //     this.codigoCartaoPedido = '';
    //     console.log(error);
    //   }
    // );
  }

  // by Hélio 11/02/2020
  public async adicionarCliente(cgccpf: string, dadosCli: any) {
    const aResult: any = await this.atualizaPedido('cliente', cgccpf);

    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVenda/update/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.numPedido;

    // await this.baseService.post(link, aResult).then(
    //   (result: any) => {
    //     this.atualizaPedidoHeader(result);
    //     this.clientSelected = true;
    //     this.docCliente = cgccpf;
    //     this.dadosCliente = dadosCli;
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
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

  // by Hélio 14/02/2020
  public async removerCliente() {
    const aResult: any = await this.atualizaPedido('cliente', '');

    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVenda/update/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.numPedido;

    // await this.baseService.post(link, aResult).then(
    //   (result: any) => {
    //     this.atualizaPedidoHeader(result);
    //     this.clientSelected = false;
    //     this.docCliente = '';
    //     this.dadosCliente = undefined;
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

  // by Hélio 12/02/2020
  public async sairPedido() {
    const mensagem =
      this.qtdItensSacola === 0
        ? 'Pedidos sem itens serão removidos permanentemente!'
        : '';
    const handler = () => {
      if (this.qtdItensSacola === 0) {
        this.limpaDadosPedido();
        this.apagarPedido(Number(this.numPedido))
          .pipe(take(1))
          .subscribe({
            next: () => {
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
  public apagarPedido(numPedido: number): Observable<any> {
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
  public async selecionaEndereco(endereco: any) {
    const aResult: any = await this.atualizaPedido(
      'seq_endereco_entrega',
      endereco.id.sequencialId
    );

    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVenda/update/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   this.numPedido;

    // await this.baseService.post(link, aResult).then(
    //   (result: any) => {
    //     this.atualizaPedidoHeader(result);
    //     this.enderecoSelected = true;
    //     this.sequencialEndereco = this.pedidoHeader.seqEnderecoEntrega;
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
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
    if (this.pedidoHeader.informarCliente === 'S') {
      if (
        !this.clientSelected &&
        (this.pedidoHeader.cgccpf_cliente === '' ||
          this.pedidoHeader.cgccpf_cliente === null)
      ) {
        console.log('Cliente obrigatorio!');
        this.openCustomPage('cliente', 'finalizaService', paginaAtual);
        return;
      }
    }

    // checa o tipo de entrega do pedido
    if (this.pedidoHeader.tipoEntrega === 'ENTREGA') {
      console.log('Pedido do tipo ENTREGA!');
      const tms = localStorage.getItem('tms');
      // checa se o TMS está ativo na filial baseado na informações retornada no login
      if (tms === 'true') {
        console.log('TMS ativo!');
        this.openCustomPage('endereco-entrega', 'finalizaService', paginaAtual);
        return;
      } else {
        console.log('TMS inativo!');
        this.openCustomPage('endereco-entrega-old', 'finalizaService', paginaAtual);
        return;
      }
    } else {
      this.openCustomPage('formas-pagamento', 'finalizaService', paginaAtual);
      return;
    }
  }
}
