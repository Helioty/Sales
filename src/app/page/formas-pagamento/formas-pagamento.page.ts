import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { FormaPagamento } from 'src/app/services/pagamento/condicao-pagamento.interface';
import { CondicaoPagamentoService } from 'src/app/services/pagamento/condicao-pagamento.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.page.html',
  styleUrls: ['./formas-pagamento.page.scss'],
})
export class FormasPagamentoPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) readonly slides: IonSlides;

  // Dados do Pedido.
  public pedidoOBS: Observable<PedidoHeader>;

  public opcoesPagamento: FormaPagamento[] = [];

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly pagamento: CondicaoPagamentoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.slides.lockSwipes(true);
    this.pedidoOBS = this.pedidoService.getPedidoAtivo();
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    const numPedido = this.pedidoService.getPedidoNumero();
    this.pagamento.getFormaPagamento(numPedido).subscribe({
      next: (result) => {
        this.opcoesPagamento = result;
        console.log('Opcões de Pagamento: ', result);
      },
    });
  }

  /**
   * @author helio.souza
   * @param opcaoPagamento
   */
  async goToCondicaoPagamento(opcaoPagamento: FormaPagamento): Promise<void> {
    await this.common.showLoader();
    this.pedidoService.setTipoPagamento(opcaoPagamento.codigo).subscribe({
      next: () => {
        this.prosseguir(opcaoPagamento);
        this.common.loading.dismiss();
      },
      error: () => {
        this.common.loading.dismiss();
      },
    });
  }

  /**
   * @author helio.souza
   * @param opcao
   */
  prosseguir(opcao: FormaPagamento): void {
    // by Ryuge 29/11/2018
    // edit by Helio 27/03/2020
    if (opcao.parcelas) {
      this.navControl.navigateForward(['/parcelamento']);
    } else {
      this.navControl.navigateRoot(['/pedido-finalizacao']);
    }
  }
}
