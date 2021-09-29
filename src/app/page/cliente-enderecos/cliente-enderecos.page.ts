import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ClienteGet, Endereco } from 'src/app/services/cliente/cliente.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-cliente-enderecos',
  templateUrl: './cliente-enderecos.page.html',
  styleUrls: ['./cliente-enderecos.page.scss'],
})
export class ClienteEnderecosPage implements OnInit {
  showOnly = true;

  // Dados do Pedido.
  public pedidoClienteOBS: Observable<ClienteGet>;

  // Dados da navegação.
  private navParams: Params;

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly navControl: NavController,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pedidoClienteOBS = this.pedidoService.getPedidoClienteOBS();
    this.getRouteParams();
    this.getNavParams();
  }

  /**
   * @author helio.souza
   */
  private getRouteParams(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.showOnly = params.showOnly === 'true';
      },
    });
  }

  /**
   * @author helio.souza
   */
  private getNavParams(): void {
    this.route.queryParams.subscribe({
      next: (params) => (this.navParams = params),
    });
  }

  /**
   * @author helio.souza
   * @param selected Endereço Selecionado.
   */
  async setEnderecoEntrega(selected: Endereco): Promise<void> {
    await this.common.showLoader();
    this.pedidoService.setEnderecoEntrega(selected).subscribe({
      next: () => {
        this.common.loading.dismiss();
        this.prosseguir();
      },
      error: () => {
        this.common.loading.dismiss();
      },
    });
  }

  /**
   * @author helio.souza
   * @description Navegação seguinte da pagina.
   */
  private prosseguir(): void {
    const paginaSeguinte = this.navParams.paginaSeguinte;
    switch (paginaSeguinte) {
      case 'back':
        this.navControl.pop();
        break;

      case 'pedido-atalhos':
        this.navControl.navigateRoot(['/pedido-atalhos']);
        break;

      default:
        this.navControl.navigateForward(['/' + paginaSeguinte]);
        break;
    }
  }
}
