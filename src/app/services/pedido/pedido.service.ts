import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BaseService } from '../base-service.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';
import { PedidoTable, PedidoItens } from 'src/app/class/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  public tipoConexao: string;
  public exibeBotaoComprar = false;
  public executaPedidoRapido = false;
  public alteracaoItemPedido = false;

  public noCard = false;
  public enderecoSelected = false;
  public valorFrete = 0;



  public condicao: any;


  public statusPedido: string;  // controla pedido; 'I' INCLUSÃO , 'M' MANUTENCAO
  public sistuacaoPedido: string;  // controla pedido, A = ABERTO , F = FINALIZADO

  public opcaoRetirada: any = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  public codigoTipoRetirada: string;

  public ItensPedidoAdd: any;
  public nomeCliente = '';


  // PEDIDO EM MANUTENÇÃO
  public numPedido = '0'; // Numero do pedido em manutenção.
  public digitoPedido: string;
  public pedidoHeader: any; // Todos os principais dados do pedido em manutenção.
  public tipoRetirada; // Tipo de retirada do pedido em manutenção.
  public tipoDocumento: any;
  public qtdItensSacola = 0; // Quantidade de itens do pedido em manutenção.

  public clientSelected = false; // Verdadeiro se o pedido em manutenção tiver um cliente selecionado.
  public docCliente = ''; // CPF/CNPJ do cliente do pedido em manutenção.
  public dadosCliente: any; // Dados do cliente do pedido em manutenção.

  public cardSelected = false; // Verdadeiro se o pedido em manutenção tiver um cartão-pedido selecionado.
  public codigoCartaoPedido = ''; // Codido do cartão-pedido do pedido em manutenção.

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private common: CommonService,
    private navControl: NavController
  ) { }


  public limpaDadosPedido() {
    this.valorFrete = 0;
    this.enderecoSelected = false;

    // Limpando cliente do pedido
    this.clientSelected = false;
    this.docCliente = '';
    this.dadosCliente = undefined;

    // Limpando cartão do pedido
    this.cardSelected = false;
    this.codigoCartaoPedido = '';

    this.alteracaoItemPedido = false;
    this.digitoPedido = '';
    this.sistuacaoPedido = 'N';
    this.tipoDocumento = '';
    this.qtdItensSacola = 0;
    this.numPedido = '0';
    this.pedidoHeader = {};
    this.statusPedido = '';
    this.docCliente = '';
    this.nomeCliente = '';
  }



  // by Hélio 06/02/2020
  public criarPedido() {
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/' + localStorage.getItem('empresa') + '/criar';
    return new Promise((resolve, reject) => {
      this.baseService.post(link, {}).then((result: any) => {
        this.pedidoHeader = result;
        this.numPedido = this.pedidoHeader.numpedido;
        this.digitoPedido = this.pedidoHeader.digito;
        this.tipoRetirada = this.pedidoHeader.tipoEntrega;
        console.log('NOVO PEDIDO');
        console.log(this.pedidoHeader);
        resolve();
      }, (error: any) => {
        console.log(error);
        reject();
      });
    });
  }

  // edit by Helio 10/03/2020
  public async getPedido(idPedido: string) {
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/' + localStorage.getItem('empresa') + '/' + idPedido;
    try {
      await this.baseService.get(link).then((result: any) => {
        return result;
      });
    } catch (error) {
      console.log(error);
    }
  }

  // by Hélio 06/02/2020
  private async atualizaPedido(tableName: any, tableValor: any) {
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
      const aResult: any = await this.atualizaPedido('entrega', this.opcaoRetirada[retirada]);

      const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/update/' + localStorage.getItem('empresa') + '/' + this.numPedido;
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

    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/update/' + localStorage.getItem('empresa') + '/' + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
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

    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/update/' + localStorage.getItem('empresa') + '/' + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
      this.clientSelected = true;
      this.docCliente = cgccpf;
      this.dadosCliente = dadosCli;
    }, (error: any) => {
      console.log(error);
    });
  }

  // by Hélio - Retorna os dados do cliente selecionado
  public retornaDadosCliente() {
    return this.dadosCliente;
  }

  // by Hélio 14/02/2020
  public async removerCliente() {
    const aResult: any = await this.atualizaPedido('cliente', '');

    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/update/' + localStorage.getItem('empresa') + '/' + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
      this.clientSelected = false;
      this.docCliente = '';
      this.dadosCliente = undefined;
    }, (error: any) => {
      console.log(error);
    });
  }

  // by Hélio 12/02/2020
  public async sairPedido() {
    const mensagem = this.qtdItensSacola === 0 ? 'Pedidos sem itens serão removidos permanentemente!' : '';
    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente sair do pedido?',
      message: mensagem,
      buttons: ['NÃO', {
        text: 'SIM',
        handler: () => {
          if (this.qtdItensSacola === 0) {
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
      }]
    });
    await alert.present();
  }

  // Apagar pedido, alterado por Hélio 14/02/2020
  public async apagarPedido(pedidoId: any) {
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/' + localStorage.getItem('empresa') + '/' + pedidoId;
    await this.baseService.post(link, {}).then(() => {
      this.limpaDadosPedido();
      this.common.showToast('Pedido apagado!');
    }, (error: any) => {
      console.log(error);
    });
  }

  // edit by Helio 10/03/2020
  public getItemPedido() {
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVendaItem/' + localStorage.getItem('empresa') + '/' + this.numPedido + '/itens';

    return new Promise((resolve) => {
      this.baseService.get(link).then((result: any) => {
        this.qtdItensSacola = result.totalElements;
        resolve(result);
      }, (error: any) => {
        console.log(error);
      });
    });
  }

  // by Helio 10/03/2020
  public addFast(body: PedidoItens) {
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVendaItem/' + localStorage.getItem('empresa') + '/' + this.numPedido + '/addfast';

    return new Promise((resolve) => {
      this.baseService.post(link, body).then((result: any) => {
        this.pedidoHeader = result.pedido;
        this.qtdItensSacola = result.items.totalElements;
        resolve(result.items);
      }, (error) => {
        console.log(error);
      });
    });
  }

  // by Helio 11/03/2020
  public removeItemPedido(codigoProduto: string) {
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVendaItem/' + localStorage.getItem('empresa') + '/' + this.numPedido + '/' + codigoProduto;

    return new Promise((resolve) => {
      this.baseService.post(link, {}).then((result: any) => {
        resolve(result);
      }, (error) => {
        console.log(error);
      });
    });
  }


}
