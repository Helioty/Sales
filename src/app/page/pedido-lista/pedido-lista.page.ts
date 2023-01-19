import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoListaService } from './pedido-lista.service';

@Component({
  standalone: true,
  selector: 'app-pedido-lista',
  templateUrl: './pedido-lista.page.html',
  styleUrls: ['./pedido-lista.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
  providers: [PedidoListaService],
})
export class PedidoListaPage {
  constructor(
    private readonly common: CommonService,
    private readonly menu: MenuController,
    private readonly navControl: NavController,
    private readonly pedidoService: PedidoService,
    public environmentInjector: EnvironmentInjector
  ) {}

  ionViewWillEnter(): void {
    this.menu.enable(true);
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.menu.enable(false);
  }

  ionViewDidLeave() {}

  /**
   * @author helio.souza
   */
  async addNovoPedido(): Promise<void> {
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
