import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
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
    public pedidoService: PedidoService,
    private alertCtrl: AlertController,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    await this.pedidoService.getItemPedido().then((result: any) => {
      this.itens = result.content;
      console.log(result);
    });
  }

  ionViewWillEnter() {
    this.focusOn();
    console.log('WillEnter Rapido');
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
    if (this.platform.is('cordova')) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = '';
          if (this.focusStatus) {
            document.getElementById('scanner').focus();
          }
        } catch (error) { }
      }, 300);
    }
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    document.getElementById('scanner').blur();
  }

  // Encerra o loop de foco no input
  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 150);
  }

  async scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
          this.pedidoService.setCardPedido(codigo);
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
  addItem(codigo: string) {
    // by Ryuge 27/11/2019 - Não permitir gravar item com pedido = '0';
    if (this.pedidoService.numPedido !== '0' || this.pedidoService.numPedido !== undefined) {
      const tipo = this.pedidoService.codigoTipoRetirada;
      const valor = 0;

      this.pedidoItens = new PedidoItens(localStorage.getItem('empresa'), parseInt(this.pedidoService.numPedido));
      this.pedidoItens.idEmpresa = parseInt(localStorage.getItem('empresa'));
      this.pedidoItens.numPedido = parseInt(this.pedidoService.numPedido);
      this.pedidoItens.idProduto = codigo;
      this.pedidoItens.embalagem = 0;
      this.pedidoItens.qtdTotal = 0;
      this.pedidoItens.prcUnitario = 0;
      this.pedidoItens.prcTotal = 0;

      this.adicionarSacola(tipo, valor, codigo);
    }
  }

  adicionarSacola(tipo: string, valor: any, codigo: string) {
    const aRetiradas: any[] = [];
    try {
      this.retiradas = new Retiradas();
      this.retiradas.empresaRetirada = parseInt(localStorage.getItem('empresa'));
      this.retiradas.idDeposito = 8;
      this.retiradas.tipoRetirada = parseInt(tipo);
      this.retiradas.qtd = 1;
      this.retiradas.precoUnitario = parseFloat(valor);
      // add array
      aRetiradas.push(this.retiradas);

      console.log('this.retiradas');
      console.log(this.pedidoItens);


      // this.pedidoService.sistuacaoPedido = 'A';  // altera situação do pedido
      this.pedidoItens.retiradas = aRetiradas;

      // by Ryuge 27/11/2019
      // controle de requisições para o mesmo produto escaneado
      if (this.codProdRequest === codigo) {
        this.numRequest += 1;
        if (this.numRequest <= this.maxRequest) {
          if (this.pedidoItens.retiradas !== [] && this.pedidoItens.idProduto !== null || this.pedidoItens.idProduto !== '') {
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
        if (this.pedidoItens.retiradas !== [] && this.pedidoItens.idProduto !== null || this.pedidoItens.idProduto !== '') {
          this.addItemPedido(this.pedidoItens);
        }
      }


    } catch (error) {
      this.common.showAlertError('erro no adicionar sacola');
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
    await this.pedidoService.addFast(body).then((result: any) => {
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
    await this.pedidoService.removeItemPedido(codigoProduto).then((result: any) => {
      this.common.showToast(result.msg);
    });
    await this.pedidoService.getItemPedido().then((result: any) => {
      this.itens = result.content;
      console.log(result);
    });
  }

}
