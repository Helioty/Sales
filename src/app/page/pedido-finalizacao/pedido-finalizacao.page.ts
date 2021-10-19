import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader, PedidoItem } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pedido-finalizacao',
  templateUrl: './pedido-finalizacao.page.html',
  styleUrls: ['./pedido-finalizacao.page.scss'],
})
export class PedidoFinalizacaoPage implements OnInit {
  public pedidoOBS: Observable<PedidoHeader>;
  public pedidoItemOBS: Observable<PedidoItem[]>;

  constructor(
    public readonly scanner: ScannerService,
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.pedidoOBS = this.pedidoService.getPedidoAtivoOBS();
    this.pedidoItemOBS = this.pedidoService.getPedidoItensOBS();
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
    this.scanner.focusOn();
    // this.totalProdutos =
    //   this.pedido.pedidoHeader.totpedido -
    //   this.pedido.pedidoHeader.frete.valor +
    //   this.pedido.pedidoHeader.descontoBrinde +
    //   this.pedido.pedidoHeader.valorDesconto;
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.scanner.focusOff();
  }

  ionViewDidLeave(): void {
    console.clear();
  }

  /**
   * @author helio.souza
   * @param value Dado scaneado.
   */
  scaneado(value: string): void {
    const codigo = value;

    if (codigo.substring(0, 1) === 'P') {
      const numPedido = this.pedidoService.getPedidoNumero();
      this.pedidoService.setCardPedido(numPedido, codigo).subscribe();
    }
  }

  /**
   * @author helio.souza
   * @description Atualiza o cartão pedido.
   */
  adicionarCartaoPedido(): void {
    this.pedidoService.adicionarCartaoPedido();
  }

  /**
   * @author helio.souza
   * @description Abre a pagina de cliente.
   */
  openClientePage(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-finalizacao',
      },
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  openFormasPagamentoPage(): void {
    this.navControl.navigateForward(['/formas-pagamento']);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-finalizacao',
      },
    };
    this.navControl.navigateForward(['/formas-pagamento'], navigationExtras);
  }
}
