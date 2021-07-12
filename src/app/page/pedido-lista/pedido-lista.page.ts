import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-pedido-lista',
  templateUrl: './pedido-lista.page.html',
  styleUrls: ['./pedido-lista.page.scss'],
})
export class PedidoListaPage implements OnInit {
  constructor(
    private readonly common: CommonService,
    private readonly menu: MenuController,
    private readonly navControl: NavController,
    private readonly pedidoService: PedidoService
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.menu.enable(true);
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.menu.enable(false);
    // console.clear();
  }

  ionViewDidLeave() {}

  addNovoPedido() {
    this.pedidoService.limpaDadosPedido();
    // await this.common.showLoaderCustom('Criando Pedido!');
    // await this.pedidoService.criarPedido().then(
    //   () => {
    //     this.navControl.navigateForward('/pedido-retirada');
    //     this.common.loading.dismiss();
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.common.loading.dismiss();
    //   }
    // );
    // try {
    //   this.disableButton = true;
    //   if (this.platform.is('ios') || this.platform.is('android')) {
    //     // by Ryuge 03/09/2019
    //     this.pedidoService.limpaDadosPedido();
    //     this.navControl.navigateForward('/pedido-retirada')
    //   } else {
    //     this.pedidoService.limpaDadosPedido();
    //     this.navControl.navigateForward('/pedido-retirada')
    //   }
    // } catch (error) {
    //   this.disableButton = false;
    // }
  }
}
