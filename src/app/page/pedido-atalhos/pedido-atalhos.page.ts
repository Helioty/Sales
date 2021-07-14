import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pedido-atalhos',
  templateUrl: './pedido-atalhos.page.html',
  styleUrls: ['./pedido-atalhos.page.scss'],
})
export class PedidoAtalhosPage implements OnInit {
  @ViewChild(IonSlides) readonly slides: IonSlides;
  totalItensOBS: Observable<number>;

  constructor(
    private readonly common: CommonService,
    public readonly scanner: ScannerService,
    public readonly pedidoService: PedidoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    console.log('Atalhos OnInit');
  }

  ionViewWillEnter(): void {
    this.scanner.focusOn();
    this.common.goToFullScreen();
    this.slides.lockSwipes(true);
    this.totalItensOBS = this.pedidoService.getTotalItensOBS();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.scanner.focusOff();
  }

  ionViewDidLeave() {}

  /**
   * @author helio.souza
   * @param value Valor escaneado.
   */
  scaneado(value: string): void {
    if (value.substring(0, 1) === 'P') {
      this.pedidoService
        .setCardPedido(this.pedidoService.pedido.value.numpedido, value)
        .subscribe();
    } else {
      this.common.showToast('Cartão Pedido inválido!');
    }
  }

  /**
   * @author helio.souza
   */
  adicionarCartaoPedido(): void {
    const handler = (data: any) => {
      this.pedidoService
        .setCardPedido(this.pedidoService.pedido.value.numpedido, data.codigo)
        .subscribe();
    };
    const props = { titulo: 'Cartão Pedido', message: '', handler };
    const inputs = [
      {
        name: 'codigo',
        type: 'text',
        placeholder: 'Digite o codigo do cartão!',
      },
    ];
    const options = {
      allowClose: true,
      showCancel: true,
      cssClasses: ['ion-alert-input'],
      inputs,
    };
    this.common.showAlertAction(props, options);
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto-atalhos',
      },
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }
}
