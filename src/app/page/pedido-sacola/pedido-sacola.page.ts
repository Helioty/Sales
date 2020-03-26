import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pedido-sacola',
  templateUrl: './pedido-sacola.page.html',
  styleUrls: ['./pedido-sacola.page.scss']
})
export class PedidoSacolaPage implements OnInit {
  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;

  // public itens: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private common: CommonService,
    public pedidoService: PedidoService,
    public pedidoItemService: PedidoItemService,
    private navControl: NavController,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.pedidoItemService.getItemPedido().then((result: any) => {
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

  ionViewDidLeave() { }

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
  }

  // Encerra o loop de foco no input
  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 150);
  }

  scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
          this.pedidoService.setCardPedido(codigo);
          this.focusPlay();
        } else {
          this.focusPlay();
        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }

  async adicionarCartaoPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Cartão Pedido',
      cssClass: 'ion-alert-input',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Digite o codigo do cartão!'
        }
      ],
      buttons: [
        'CANCELAR',
        {
          text: 'ADICIONAR',
          handler: (data: any) => {
            this.pedidoService.setCardPedido(data.codigo);
          }
        }
      ]
    });
    alert.onDidDismiss().finally(() => {
      this.focusPlay();
    });
    await alert.present().then(() => {
      this.focusPause();
    });
  }

  // by Hélio 11/03/2020
  async removerProduto(produto: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remover produto',
      message:
        'Tem certeza que deseja remover o produto ' +
        produto.descricao +
        ' do pedido?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel'
        },
        {
          text: 'REMOVER',
          handler: () => {
            this.deleteItemPedido(produto.idProduto);
          }
        }
      ]
    });
    alert.onDidDismiss().finally(() => {
      this.focusPlay();
    });
    await alert.present().then(() => {
      this.focusPause();
    });
  }

  async deleteItemPedido(codigoProduto: string) {
    await this.pedidoItemService.removeItemPedido(codigoProduto).then((result: any) => {
      this.common.showToast(result.msg);
    });
    await this.pedidoItemService.getItemPedido().then((result: any) => {
      // this.itens = result.content;
      console.log(result);
    });
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-sacola'
      }
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
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

  // finalização do pedido
  finalizarPedido() {
    // checa se é necessario informar o cliente
    if (this.pedidoService.pedidoHeader.informarCliente === 'S') {
      if (!this.pedidoService.clientSelected &&
        (this.pedidoService.pedidoHeader.cgccpf_cliente === '' ||
          this.pedidoService.pedidoHeader.cgccpf_cliente === null)
      ) {
        console.log('Cliente obrigatorio!');
        this.openCustomPage('cliente', 'finzalizaService', 'pedido-sacola');
        return;
      }
    }

    // checa o tipo de entrega do pedido
    if (this.pedidoService.pedidoHeader.tipoEntrega === 'ENTREGA') {
      console.log('Pedido do tipo ENTREGA!');
      const tms = localStorage.getItem('tms');
      // checa se o TMS está ativo na filial baseado na informações retornada no login
      if (tms === 'true') {
        console.log('TMS ativo!');
        this.openCustomPage('endereco-entrega', 'finzalizaService', 'pedido-sacola');
        return;
      } else {
        console.log('TMS inativo!');
        this.openCustomPage('endereco-entrega-old', 'finzalizaService', 'pedido-sacola');
        return;
      }
    } else {
      this.openCustomPage('formas-pagamento', 'finzalizaService', 'pedido-sacola');
      return;
    }
  }

}
