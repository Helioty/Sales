import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BaseService } from '../HTTP/base-service.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { PedidoHeader, PedidoTable } from 'src/app/class/pedido';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';
import { NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
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
  public sistuacaoPedido: string; // controla pedido, A = ABERTO , F = FINALIZADO

  public opcaoRetirada: any = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  public codigoTipoRetirada: string;

  public ItensPedidoAdd: any;
  public nomeCliente = '';

  // PEDIDO EM MANUTENÇÃO
  public pedidoHeader = new PedidoHeader(); // Todos os principais dados do pedido em manutenção.
  public numPedido = '0'; // Numero do pedido em manutenção.
  public digitoPedido: number;
  public tipoRetirada: string; // Tipo de retirada do pedido em manutenção.
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
  public sequencialEndereco = 0;

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private common: CommonService,
    private clienteService: ClienteService,
    private navControl: NavController
  ) { }

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

    this.valorFrete = 0;
    this.enderecoSelected = false;

    this.alteracaoItemPedido = false;
    this.digitoPedido = null;
    this.sistuacaoPedido = 'N';
    this.tipoDocumento = '';
    this.qtdItensSacola = 0;
    this.statusPedido = '';
    this.docCliente = '';
    this.nomeCliente = '';
  }

  // by Helio 20/03/2020
  public atualizaPedidoHeader(pedidoHeader: PedidoHeader) {
    this.pedidoHeader = pedidoHeader;
    this.numPedido = pedidoHeader.numpedido.toString();
    this.digitoPedido = pedidoHeader.digito;

    this.tipoRetirada = pedidoHeader.tipoEntrega;
    switch (pedidoHeader.tipoEntrega) {
      case 'IMEDIATA':
        this.codigoTipoRetirada = '0';
        break;
      case 'POSTERIOR':
        this.codigoTipoRetirada = '1';
        break;
      case 'ENTREGA':
        this.codigoTipoRetirada = '2';
        break;

      default:
        break;
    }

    this.qtdItensSacola = pedidoHeader.numitens;

    console.log('PEDIDO HEADER ATUALIZADO');
    console.log(this.pedidoHeader);
  }

  // by Hélio 06/02/2020
  public criarPedido() {
    const link =
      ENV.WS_VENDAS +
      API_URL +
      'PedidoVenda/' +
      localStorage.getItem('empresa') +
      '/criar';

    return new Promise((resolve, reject) => {
      this.baseService.post(link, {}).then((result: any) => {
        this.atualizaPedidoHeader(result);
        console.log('Pedido criado!');
        resolve();
      }, (error: any) => {
        console.log(error);
        reject();
      });
    });
  }

  // edit by Helio 10/03/2020
  public async getPedido(idPedido: string) {
    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVenda/' +
      localStorage.getItem('empresa') + '/' +
      idPedido;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  // by Hélio 06/02/2020
  public async atualizaPedido(tableName: any, tableValor: any) {
    const aResult = [];
    const table: PedidoTable = new PedidoTable();
    table.name = tableName;
    table.value = tableValor;
    aResult.push(table);
    return aResult;
  }

  // by Hélio 11/03/2020
  public async alterarTipoRetirada(retirada: string) {
    if (retirada !== this.codigoTipoRetirada) {
      const aResult: any = await this.atualizaPedido(
        'entrega',
        this.opcaoRetirada[retirada]
      );

      const link =
        ENV.WS_VENDAS +
        API_URL +
        'PedidoVenda/update/' +
        localStorage.getItem('empresa') +
        '/' +
        this.numPedido;

      return new Promise((resolve, reject) => {
        this.baseService.post(link, aResult).then(() => {
          resolve();
        }, (error: any) => {
          console.log(error);
          reject();
        });
      });
    }
  }

  // alterado por Nicollas Bastos em 25/09/2018
  // alterado por Hélio 06/02/2020
  public async setCardPedido(codCard: string) {
    const aResult: any = await this.atualizaPedido('cartao_pedido', codCard);

    const link =
      ENV.WS_VENDAS +
      API_URL +
      'PedidoVenda/update/' +
      localStorage.getItem('empresa') +
      '/' +
      this.numPedido;

    await this.baseService.post(link, aResult).then((result: any) => {
      this.atualizaPedidoHeader(result);
      this.cardSelected = true;
      this.codigoCartaoPedido = codCard;
      this.common.showToast('Cartão Pedido Adicionado!');
    }, (error: any) => {
      this.cardSelected = false;
      this.codigoCartaoPedido = '';
      console.log(error);
    });
  }

  // by Hélio 11/02/2020
  public async adicionarCliente(cgccpf: string, dadosCli: any) {
    const aResult: any = await this.atualizaPedido('cliente', cgccpf);

    const link =
      ENV.WS_VENDAS +
      API_URL +
      'PedidoVenda/update/' +
      localStorage.getItem('empresa') +
      '/' +
      this.numPedido;

    await this.baseService.post(link, aResult).then((result: any) => {
      this.atualizaPedidoHeader(result);
      this.clientSelected = true;
      this.docCliente = cgccpf;
      this.dadosCliente = dadosCli;
    }, (error: any) => {
      console.log(error);
    });
  }

  // by Hélio - Retorna os dados do cliente selecionado
  public async retornaDadosCliente() {
    if (
      this.clientSelected &&
      this.docCliente !== '' &&
      this.dadosCliente === undefined
    ) {
      await this.common.showLoader();
      await this.clienteService.getClienteNoAlert(this.docCliente).then((result: any) => {
        this.dadosCliente = result;
        this.common.loading.dismiss();
        return;
      }, () => {
        this.common.loading.dismiss();
      });
    } else {
      return;
    }
  }

  // by Hélio 14/02/2020
  public async removerCliente() {
    const aResult: any = await this.atualizaPedido('cliente', '');

    const link =
      ENV.WS_VENDAS +
      API_URL +
      'PedidoVenda/update/' +
      localStorage.getItem('empresa') +
      '/' +
      this.numPedido;

    await this.baseService.post(link, aResult).then((result: any) => {
      this.atualizaPedidoHeader(result);
      this.clientSelected = false;
      this.docCliente = '';
      this.dadosCliente = undefined;
    }, (error: any) => {
      console.log(error);
    });
  }

  // by Hélio 12/02/2020
  public async sairPedido() {
    const mensagem =
      this.qtdItensSacola === 0
        ? 'Pedidos sem itens serão removidos permanentemente!'
        : '';
    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente sair do pedido?',
      message: mensagem,
      buttons: [
        'NÃO',
        {
          text: 'SIM',
          handler: () => {
            if (this.qtdItensSacola === 0) {
              this.limpaDadosPedido();
              this.apagarPedido(this.numPedido).then(() => {
                this.navControl.navigateRoot('/pedido-lista');
                console.clear();
              });
            } else {
              this.limpaDadosPedido();
              this.navControl.navigateRoot('/pedido-lista');
              console.clear();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Apagar pedido, alterado por Hélio 14/02/2020
  public async apagarPedido(pedidoId: any) {
    const link =
      ENV.WS_VENDAS +
      API_URL +
      'PedidoVenda/' +
      localStorage.getItem('empresa') +
      '/' +
      pedidoId;

    await this.baseService.post(link, {}).then(() => {
      this.limpaDadosPedido();
      this.common.showToast('Pedido apagado!');
    }, (error: any) => {
      console.log(error);
    });
  }

  // abrindo pagina customizada utilizando parametros
  openCustomPage(P: string, PS: string, PA: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: PS,
        paginaAnterior: PA
      }
    };
    this.navControl.navigateForward(['/' + P], navigationExtras);
  }

  goToFinalizacao(paginaAtual: string) {
    // checa se é necessario informar o cliente
    if (this.pedidoHeader.informarCliente === 'S') {
      if (!this.clientSelected &&
        (this.pedidoHeader.cgccpf_cliente === '' || this.pedidoHeader.cgccpf_cliente === null)
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
