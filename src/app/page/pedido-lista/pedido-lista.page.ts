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

  /**
   * @author helio.souza
   */
  async addNovoPedido(): Promise<void> {
    this.pedidoService.limpaDadosPedido();
    await this.common.showLoaderCustom('Criando pedido...');
    this.pedidoService.criarPedido().subscribe({
      next: () => {
        this.common.loading.dismiss();
        this.navControl.navigateForward('/pedido-retirada');
      },
      error: () => {
        this.common.loading.dismiss();
      },
    });
  }
}
