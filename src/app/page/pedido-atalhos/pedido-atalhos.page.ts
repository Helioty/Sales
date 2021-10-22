import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pedido-atalhos',
  templateUrl: './pedido-atalhos.page.html',
  styleUrls: ['./pedido-atalhos.page.scss'],
})
export class PedidoAtalhosPage implements OnInit {
  public pedidoOBS: Observable<PedidoHeader>;
  public totalItensOBS: Observable<number>;

  constructor(
    private readonly common: CommonService,
    public readonly scanner: ScannerService,
    public readonly pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    console.log('Atalhos OnInit');
  }

  ionViewWillEnter(): void {
    this.scanner.focusOn();
    this.common.goToFullScreen();
    this.pedidoOBS = this.pedidoService.getPedidoAtivoOBS();
    this.totalItensOBS = this.pedidoService.getTotalItensOBS();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.scanner.focusOff();
  }

  ionViewDidLeave(): void {}

  /**
   * @author helio.souza
   * @param value Valor escaneado.
   */
  scaneado(value: string): void {
    if (value.substring(0, 1) === 'P') {
      this.pedidoService
        .setCardPedido(this.pedidoService.getPedidoNumero(), value)
        .subscribe();
    } else {
      this.common.showToast('Cartão Pedido inválido!');
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
   */
  openClientePage(): void {
    this.pedidoService.openCustomPage('cliente', 'back', 'pedido-atalhos');
  }

  /**
   * @author helio.souza
   */
  sairPedido(): void {
    this.pedidoService.sairPedido();
  }
}
