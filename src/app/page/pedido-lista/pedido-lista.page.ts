import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';

import { BaseService } from 'src/app/services/base-service.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-pedido-lista',
  templateUrl: './pedido-lista.page.html',
  styleUrls: ['./pedido-lista.page.scss'],
})
export class PedidoListaPage implements OnInit {

  public totalEmAberto = 0;
  public totalFinalizados = 0;

  public disableButton = false;

  constructor(
    public common: CommonService,
    private menu: MenuController,
    private navControl: NavController,
    public baseService: BaseService,
    public pedidoService: PedidoService,
    public platform: Platform,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.menu.enable(true);
    this.disableButton = false;
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.menu.enable(false);
    //console.clear();
  }

  ionViewDidLeave() {

  }

  async addNovoPedido() {
    this.pedidoService.limpaDadosPedido();
    await this.common.showLoaderCustom('Criando Pedido!');
    await this.pedidoService.criarPedido().then(() => {
      this.navControl.navigateForward('/pedido-retirada');
      this.common.loading.dismiss();
    }, (error) => {
      console.log(error);
      this.common.loading.dismiss();
    });
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


  checaAtivo(id: string, id2: string) {
    // console.log('A')
    // let elemento = document.getElementById(id);
    // let classes = elemento.className.split(' ');
    // let getIndex = classes.indexOf('fab-button-close-active');

    // let elemento2 = document.getElementById(id2);
    // let classes2 = elemento2.className.split(' ');
    // let getIndex2 = classes2.indexOf('contentOpaco');

    // if (getIndex === -1) {
    //   classes.push('contentOpaco');
    //   elemento2.className = classes.join(' ');
    // }
    // else {
    //   classes2.splice(getIndex2, 1);
    //   elemento2.className = classes.join(' ');
    // }
  }

  async getPedidosEmAberto(page: number) {
    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVenda/list/' +
      localStorage.getItem('empresa') + '/abertos?page=' + page;

    return await this.baseService.get(link);
  }

  async getPedidosFinalizados(page: number) {
    const link =
      ENV.WS_VENDAS + API_URL + 'PedidoVenda/list/' +
      localStorage.getItem('empresa') + '/faturados?page=' + page;

    return await this.baseService.get(link);
  }

}
