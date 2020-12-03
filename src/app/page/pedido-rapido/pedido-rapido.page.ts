import { Component, OnInit } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { PedidoItens, Retiradas } from 'src/app/class/pedido';

@Component({
  selector: 'app-pedido-rapido',
  templateUrl: './pedido-rapido.page.html',
  styleUrls: ['./pedido-rapido.page.scss'],
})
export class PedidoRapidoPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;

  public itens: any[] = [];

  public pedidoItens: PedidoItens;
  public retiradas: Retiradas;


  // controle de requisições by Ryuge 28/11/2019
  private maxRequest = 10;
  private numRequest = 0;
  private codProdRequest = '';

  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    public pedidoIt: PedidoItemService,
    private alertCtrl: AlertController,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    await this.pedidoIt.getItemPedido().then((result: any) => {
      this.itens = result.content;
      console.log(result);
    });
  }

  ionViewWillEnter() {
    this.focusOn();
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.focusOff();
  }

  ionViewDidLeave() {
    console.clear();
  }

  // Cria o loop que da foco no input
  focusOn() {
    this.taskScanner = setInterval(() => {
      try {
        this.valorScanner = '';
        if (this.focusStatus) {
          const scanners = document.body.getElementsByClassName('scanner');
          for (const i in scanners) {
            if (Number(i) === (scanners.length - 1)) {
              (scanners[i] as HTMLInputElement).focus();
            }
          }
        }
      } catch (error) { }
    }, 350);
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    const scanners = document.body.getElementsByClassName('scanner');
    for (const i in scanners) {
      if (Number(i) === (scanners.length - 1)) {
        (scanners[i] as HTMLInputElement).blur();
      }
    }
  }

  // Encerra o loop de foco no input
  focusOff() {
    clearInterval(this.taskScanner);
  }

  scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
          this.pedido.setCardPedido(codigo);
          this.focusPlay();
        } else {
          this.addItem(codigo);
          this.focusPlay();
        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }

  // by Ryuge
  // edit by Helio 10/03/2020
  addItem(codigo: string | number) {
    // by Ryuge 27/11/2019 - Não permitir gravar item com pedido = '0';
    if (this.pedido.numPedido !== '0' || this.pedido.numPedido !== undefined) {
      const tipo = this.pedido.codigoTipoRetirada;
      const valor = 0;

      this.pedidoItens = new PedidoItens(
        localStorage.getItem('empresa'),
        // tslint:disable-next-line: radix
        parseInt(this.pedido.numPedido)
      );
      // tslint:disable-next-line: radix
      this.pedidoItens.idEmpresa = parseInt(localStorage.getItem('empresa'));
      // tslint:disable-next-line: radix
      this.pedidoItens.numPedido = parseInt(this.pedido.numPedido);
      this.pedidoItens.idProduto = String(codigo);
      this.pedidoItens.embalagem = 0;
      this.pedidoItens.qtdTotal = 0;
      this.pedidoItens.prcUnitario = 0;
      this.pedidoItens.prcTotal = 0;

      this.adicionarSacola(tipo, valor, String(codigo));
    }
  }

  adicionarSacola(tipo: string, valor: any, codigo: string) {
    const aRetiradas: any[] = [];
    try {
      this.retiradas = new Retiradas();
      // tslint:disable-next-line: radix
      this.retiradas.empresaRetirada = parseInt(localStorage.getItem('empresa'));
      this.retiradas.idDeposito = 8;
      // tslint:disable-next-line: radix
      this.retiradas.tipoRetirada = parseInt(tipo);
      this.retiradas.qtd = 1;
      this.retiradas.precoUnitario = parseFloat(valor);
      // add array
      aRetiradas.push(this.retiradas);

      console.log('this.retiradas');
      console.log(this.pedidoItens);

      // this.pedido.sistuacaoPedido = 'A';  // altera situação do pedido
      this.pedidoItens.retiradas = aRetiradas;

      // by Ryuge 27/11/2019
      // controle de requisições para o mesmo produto escaneado
      if (this.codProdRequest === codigo) {
        this.numRequest += 1;
        if (this.numRequest <= this.maxRequest) {
          if (this.pedidoItens.retiradas !== [] &&
            (this.pedidoItens.idProduto !== null || this.pedidoItens.idProduto !== '')) {
            this.addItemPedido(this.pedidoItens);
          }
        } else {
          this.common.showToast('Favor aguarde processamento...');
          // by Helio - libera as requisições apos certo periodo
          if (this.numRequest === this.maxRequest) {
            setTimeout(() => {
              this.numRequest = 0;
            }, 2000);
          }
        }
      } else {
        this.numRequest = 0;
        this.codProdRequest = codigo;
        if (this.pedidoItens.retiradas !== [] &&
          (this.pedidoItens.idProduto !== null || this.pedidoItens.idProduto !== '')) {
          this.addItemPedido(this.pedidoItens);
        }
      }
    } catch (error) {
      this.common.showAlertInfo('Erro no adicionar sacola');
      // by Ryuge 28/11/2019
      if (error.status === 400) {
        // await this.showMessage(error.json().title, error.json().detail);
      } else if (error.status === 503) {
        this.common.showAlert('Atenção!', 'Sem serviço, entrar em contato com suporte.');
      } else {
        if (error.error.detail) {
          this.common.showAlert(error.error.title, error.error.detail);
        } else {
          this.common.showAlert('Atenção!', JSON.stringify(error));
        }
      }
    }
  }

  // by Ryuge
  // edit by Helio 10/03/2020
  async addItemPedido(body: PedidoItens) {
    await this.pedidoIt.addFast(body).then((result: any) => {
      this.itens = result.content;
      if (this.numRequest > 1) {
        this.numRequest -= 1;
      }
      console.log(result);
    }, (error) => {
      console.log(error);
    });

    // this.commonServices.ItensPedidoAdd = result.pedido; // cabeçalho dp pedido
    // this.totalPedido = result.pedido.totpedido;

  }

  // by Hélio 11/03/2020
  async removerProduto(produto: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remover produto',
      message: 'Tem certeza que deseja remover o produto ' + produto.descricao + ' do pedido?',
      buttons: [{
        text: 'CANCELAR',
        role: 'cancel'
      }, {
        text: 'REMOVER',
        handler: () => {
          this.deleteItemPedido(produto.idProduto);
        }
      }]
    });
    alert.onDidDismiss().finally(() => { this.focusPlay(); });
    await alert.present().then(() => {
      this.focusPause();
    });
  }

  async deleteItemPedido(codigoProduto: string) {
    await this.pedidoIt.removeItemPedido(codigoProduto).then((result: any) => {
      this.common.showToast(result.msg);
    });
    await this.pedidoIt.getItemPedido().then((result: any) => {
      this.itens = result.content;
      console.log(result);
    });
  }

}
