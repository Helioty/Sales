import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BaseService } from './base-service.service';
import { CommonService } from 'src/app/services/common.service';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';
import { PedidoTable } from '../class/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  public tipoConexao: string;
  public exibeBotaoComprar: boolean = false;
  public executaPedidoRapido: boolean = false;
  public alteracaoItemPedido: boolean = false;

  public noCard: boolean = false;
  public enderecoSelected: boolean = false;
  public valorFrete = 0;



  public condicao: any;


  public statusPedido: string;  // controla pedido; 'I' INCLUSÃO , 'M' MANUTENCAO
  public sistuacaoPedido: string;  // controla pedido, A = ABERTO , F = FINALIZADO

  public opcaoRetirada: any = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  public codigoTipoRetirada: string;

  public ItensPedidoAdd: any;
  public nomeCliente: String = '';


  // PEDIDO EM MANUTENÇÃO
  public numPedido: string = '0';
  public digitoPedido: string;
  public pedidoHeader: any;
  public tipoRetirada: any;
  public tipoDocumento: any;
  public qtdItensSacola: number = 0;

  public clientSelected: boolean = false;
  public docCliente: string = '';
  public dadosCliente: any;

  public cardSelected: boolean = false;
  public codigoCartaoPedido: string = '';

  constructor(
    public alertCtrl: AlertController,
    public baseService: BaseService,
    public common: CommonService,
    public navControl: NavController
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
  public async criarPedido() {
    let link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/' + localStorage.getItem('empresa') + '/criar';
    await this.baseService.post(link, {}).then((result: any) => {
      this.pedidoHeader = result;
      console.log('NOVO PEDIDO');
      console.log(this.pedidoHeader);

      this.numPedido = this.pedidoHeader.numpedido;
      this.digitoPedido = this.pedidoHeader.digito;
    }, (error: any) => {
      this.common.showToast(error.detail);
      this.navControl.back()
    })

  }

  // by Hélio 06/02/2020
  private async atualizaPedido(tableName: any, tableValor: any) {
    let aResult = [];
    let table: PedidoTable = new PedidoTable();
    table.name = tableName;
    table.value = tableValor;
    aResult.push(table);
    return aResult
  }

  // alterado por Nicollas Bastos em 25/09/2018
  // alterado por Hélio 06/02/2020
  public async setCardPedido(codCard: string) {
    let aResult: any = await this.atualizaPedido("cartao_pedido", codCard);

    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/update/" + localStorage.getItem("empresa") + "/" + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
      this.cardSelected = true;
      this.codigoCartaoPedido = codCard;
      this.common.showToast("Cartão Pedido Adicionado com sucesso!");
    }, (error: any) => {
      this.cardSelected = false;
      this.codigoCartaoPedido = '';
      if (error.error.detail) {
        this.common.showAlert(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError(JSON.stringify(error));
      }
    });

  }

  // by Hélio 11/02/2020
  public async adicionarCliente(cgccpf: string, dadosCli: any) {
    let aResult: any = await this.atualizaPedido("cliente", cgccpf);

    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/update/" + localStorage.getItem("empresa") + "/" + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
      this.clientSelected = true;
      this.docCliente = cgccpf;
      this.dadosCliente = dadosCli;
    }, (error: any) => {
      console.log(error);
      if (error.error.detail) {
        this.common.showAlert(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError(JSON.stringify(error));
      }
    });

  }

  public retornaDadosCliente() {
    return this.dadosCliente;
  }

  // by Hélio 14/02/2020
  public async removerCliente() {
    let aResult: any = await this.atualizaPedido("cliente", "");

    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/update/" + localStorage.getItem("empresa") + "/" + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
      this.clientSelected = false;
      this.docCliente = "";
      this.dadosCliente = undefined;
    }, (error: any) => {
      console.log(error);
      if (error.error.detail) {
        this.common.showAlert(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError(JSON.stringify(error));
      }
    });

  }

  // by Hélio 12/02/2020
  public async sairPedido() {
    const mensagem = this.qtdItensSacola == 0 ? "Pedidos sem itens serão removidos permanentemente!" : "";
    const alert = await this.alertCtrl.create({
      header: "Deseja realmente sair do pedido?",
      message: mensagem,
      buttons: ['NÃO', {
        text: 'SIM',
        handler: () => {
          if (this.qtdItensSacola == 0) {
            this.apagarPedido(this.numPedido).then(() => {
              this.navControl.navigateRoot('/pedido-lista');
            });
          } else {
            this.limpaDadosPedido();
            this.navControl.navigateRoot('/pedido-lista');
          }
        }
      }]
    });
    await alert.present();
  }

  // Apagar pedido, alterado por Hélio 14/02/2020
  public async apagarPedido(pedidoId: any) {
    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/" + localStorage.getItem("empresa") + "/" + pedidoId;
    await this.baseService.post(link, {}).then(() => {
      this.limpaDadosPedido();
      this.common.showToast("Pedido apagado!");
    }, (error: any) => {
      if (error.error.detail) {
        this.common.showAlert(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError(JSON.stringify(error));
      }
    });

  }

}
