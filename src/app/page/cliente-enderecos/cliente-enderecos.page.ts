import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  onlyShow = true;

  // Dados do Pedido.
  public pedidoClienteOBS: Observable<ClienteGet>;

  // Dados da navegação.
  private navParams: Params;

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
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
        this.onlyShow = params.acao !== 'entrega';
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
    console.log('Endereço Selecionado: ', selected);
    await this.common.showLoader();
    this.pedidoService.setEnderecoEntrega(selected).subscribe({
      next: () => {
        this.common.loading.dismiss();
      },
      error: () => {
        this.common.loading.dismiss();
      },
    });
  }
}
