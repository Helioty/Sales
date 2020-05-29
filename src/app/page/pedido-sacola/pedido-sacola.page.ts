import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
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

  public showInfo = false;

  constructor(
    private alertCtrl: AlertController,
    private common: CommonService,
    public pedido: PedidoService,
    public pedidoIt: PedidoItemService,
    private produtoS: ProdutoService,
    private navControl: NavController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.pedidoIt.getItemPedido().then((result: any) => {
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
          this.pedido.setCardPedido(codigo);
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
            this.pedido.setCardPedido(data.codigo);
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
    await this.pedidoIt.removeItemPedido(codigoProduto).then((result: any) => {
      this.common.showToast(result.msg);
    });
    await this.pedidoIt.getItemPedido().then((result: any) => {
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

  openProdutoAddSacolaPage(prod: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-sacola',
        produto: JSON.stringify(prod)
      }
    };
    this.navControl.navigateForward(['/produto-adicionar-sacola'], navigationExtras);
  }

  getProduto(codigo: string) {
    this.produtoS.getProduto(codigo).then((result: any) => {
      this.openProdutoAddSacolaPage(result.content[0]);
    });
  }

  // finalização do pedido
  finalizarPedido() {
    this.pedido.goToFinalizacao('pedido-sacola');
  }

}
