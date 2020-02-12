import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BaseService } from './base-service.service';
import { BaseCommon } from 'src/commons/base-common';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/config/app.config';
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



  public condicao;


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
  public codigoBarraCartaoPedido: any;

  constructor(
    public alertCtrl: AlertController,
    public baseService: BaseService,
    public common: BaseCommon,
    public navControl: NavController
  ) { }


  public limpaDadosPedido() {
    this.valorFrete = 0;
    this.enderecoSelected = false;
    this.codigoCartaoPedido = '';
    this.cardSelected = false;

    this.clientSelected = false;
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
    }, (err) => {
      this.common.showToast(err.detail);
      this.navControl.back()
    })

  }

  // by Hélio 06/02/2020
  public async atualizaPedido(name: any, valor: any) {
    try {
      let aResult = [];
      let table: PedidoTable = new PedidoTable();
      table.name = name;
      table.value = valor;
      aResult.push(table);

      // by Hélio 06/02/2020
      let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/update/" + localStorage.getItem("empresa") + "/" + this.numPedido;
      await this.baseService.post(link, aResult).then((result: any) => {
        console.log('Pedido Atualizado!');
        this.pedidoHeader = result;
      }, (erro: any) => {
        if (erro.error.title) {
          this.common.showAlert(erro.error.title, erro.error.detail);
        }
      });

    } catch (error) {
      console.log(error);
    }

  }

  // alterado por Nicollas Bastos em 25/09/2018
  // alterado por Hélio 06/02/2020
  public async setCardPedido(codCard: string) {
    let aResult = [];
    let table: PedidoTable = new PedidoTable();
    table.name = "cartao_pedido";
    table.value = codCard;
    aResult.push(table);

    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/update/" + localStorage.getItem("empresa") + "/" + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.pedidoHeader = result;
      this.cardSelected = true;
      this.codigoCartaoPedido = codCard;
      this.common.showToast("Cartão Pedido Adicionado com sucesso!");
    }, (erro: any) => {
      this.cardSelected = false;
      this.codigoCartaoPedido = '';
      this.common.showAlert(erro.error.title, erro.error.detail);
    });

  }

  // by Hélio 11/02/2020
  public async adicionarCliente(cgccpf: string, dadosCli: any) {
    let aResult = [];
    let table: PedidoTable = new PedidoTable();
    table.name = "cliente";
    table.value = cgccpf;
    aResult.push(table);

    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/update/" + localStorage.getItem("empresa") + "/" + this.numPedido;
    await this.baseService.post(link, aResult).then((result: any) => {
      this.clientSelected = true;
      this.docCliente = cgccpf;
      this.dadosCliente = dadosCli;
      return result;
    }, (error: any) => {
      console.log(error);
      return error;
    });
  }

  public retornaDadosCliente() {
    return this.dadosCliente;
  }

  // by Hélio 12/02/2020
  async sairPedido() {
    const alert = await this.alertCtrl.create({
      // header: "Logout",
      subHeader: "Deseja sair do pedido?",
      buttons: ['NÃO', {
        text: 'SIM',
        handler: () => {
          this.limpaDadosPedido();
          this.navControl.navigateRoot('/pedido-lista');
        }
      }]
    });
    await alert.present();
  }

}
