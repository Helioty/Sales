import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { DataService } from 'src/app/services/data/data.service';
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

  // by Helio 11/12/2019
  public existeProdEntrega = false;
  public existeProdRetirada = false;
  public existeProdRetiradaDepo = false;

  constructor(
    private alertCtrl: AlertController,
    private dataService: DataService,
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
      result.content.forEach(el => {
        if (el.retiradas[0].tipoRetirada === 9997) {
          this.existeProdEntrega = true;
        } else if (el.retiradas[0].tipoRetirada !== 9997) {
          this.existeProdRetirada = true;
        }
      });
      // for (let i = 0; i < result.content.length; i++) {
      //   if (result.content[i].retiradas[0].tipoRetirada == 9997) {
      //     this.existeProdEntrega = true;
      //   } else if (result.content[i].retiradas[0].tipoRetirada != 9997) {
      //     this.existeProdRetirada = true;
      //   }
      // }
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
        paginaAnterior: 'pedido-sacola'
      }
    };
    this.dataService.setData('produto-adicionar-sacola', prod);
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
