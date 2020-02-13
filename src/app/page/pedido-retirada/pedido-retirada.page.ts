import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { BaseCommon } from 'src/commons/base-common';
import { PedidoService } from 'src/app/services/pedido-service.service';
import { BaseService } from 'src/app/services/base-service.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pedido-retirada',
  templateUrl: './pedido-retirada.page.html',
  styleUrls: ['./pedido-retirada.page.scss'],
})
export class PedidoRetiradaPage implements OnInit {

  public disableButton: boolean = false;

  constructor(
    public common: BaseCommon,
    private menu: MenuController,
    private navControl: NavController,
    public baseService: BaseService,
    public pedidoService: PedidoService,
    public platform: Platform,
  ) { }

  async ngOnInit() {
    await this.pedidoService.criarPedido();
  }

  ionViewWillEnter() {
    this.menu.enable(false);
    this.disableButton = false;
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  async openPesquisaProduto(tipoRetirada: string) {
    this.pedidoService.sistuacaoPedido = "A";
    this.pedidoService.codigoTipoRetirada = tipoRetirada;
    this.pedidoService.tipoRetirada = this.pedidoService.opcaoRetirada[tipoRetirada];

    // by Ryuge 14/11/2019
    if (this.pedidoService.tipoRetirada == "ENTREGA") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          paginaSeguinte: 'produto-pesquisa',
          paginaAnterior: 'pedido-retirada'
        }
      };
      this.navControl.navigateForward(["/cliente"], navigationExtras);
    }
    else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          paginaSeguinte: 'back',
          paginaAnterior: ''
        }
      };
      this.navControl.navigateRoot(["/produto-pesquisa"], navigationExtras);
    }
  }

}
