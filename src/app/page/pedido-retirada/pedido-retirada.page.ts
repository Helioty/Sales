import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
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

    await this.pedidoService.alterarTipoRetirada(tipoRetirada).then(() => {
      // by Ryuge 14/11/2019
      // edit by Helio 14/02/2020
      if (this.pedidoService.tipoRetirada == "ENTREGA") {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            paginaSeguinte: 'pedido-atalhos',
            paginaAnterior: 'pedido-retirada'
          }
        };
        this.navControl.navigateForward(["/cliente"], navigationExtras);
      }
      else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            paginaSeguinte: '',
            paginaAnterior: 'pedido-retirada'
          }
        };
        this.navControl.navigateRoot(["/pedido-atalhos"], navigationExtras);
      }
    }, (error) => {
      console.log(error);
    });
  }

}
