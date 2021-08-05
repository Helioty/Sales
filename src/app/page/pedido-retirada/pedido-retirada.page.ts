import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-pedido-retirada',
  templateUrl: './pedido-retirada.page.html',
  styleUrls: ['./pedido-retirada.page.scss'],
})
export class PedidoRetiradaPage implements OnInit {
  constructor(
    private readonly common: CommonService,
    private readonly menu: MenuController,
    private readonly navControl: NavController,
    private readonly pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.menu.enable(false);
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  /**
   * @author helio.souza
   * @param tipoRetiradaIndex Index dos tipos de Entrega.
   */
  async openPesquisaProduto(tipoRetiradaIndex: number): Promise<void> {
    // this.pedidoService.sistuacaoPedido = 'A';
    await this.common.showLoader();
    this.pedidoService
      .alterarTipoRetirada(this.pedidoService.getPedidoNumero(), tipoRetiradaIndex)
      .subscribe({
        next: () => {
          this.common.loading.dismiss();
          this.navegar(tipoRetiradaIndex);
        },
        error: () => {
          this.common.loading.dismiss();
        },
      });
  }

  /**
   * @author helio.souza
   * @param tipoRetiradaIndex Index dos tipos de Entrega.
   */
  navegar(tipoRetiradaIndex: number): void {
    // by Ryuge 14/11/2019
    // edit by Helio 14/02/2020
    if (tipoRetiradaIndex === 3) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          paginaSeguinte: 'endereco-entrega',
          paginaAnterior: 'pedido-retirada',
        },
      };
      this.navControl.navigateForward(['/cliente'], navigationExtras);
    } else {
      this.navControl.navigateRoot(['/pedido-atalhos']);
    }
  }
}
