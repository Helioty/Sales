import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
  // Dados do Pedido.
  public pedidoOBS: Observable<PedidoHeader>;

  // opções de pagamento do pedido.
  public opcoesPagamento: FormaPagamento[] = [];

  // controler de loading.
  isLoading = true;

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly pagamento: CondicaoPagamentoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.pedidoOBS = this.pedidoService.getPedidoAtivoOBS();
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    this.getFormasPagamento();
  }

  /**
   * @author helio.souza
   */
  getFormasPagamento(): void {
    this.isLoading = true;
    const numPedido = this.pedidoService.getPedidoNumero();
    this.pagamento.getFormaPagamento(numPedido).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.opcoesPagamento = result;
        console.log('Opcões de Pagamento: ', result);
      },
      error: () => (this.isLoading = false),
    });
  }

  /**
   * @author helio.souza
   * @param opcaoPagamento Opção de pagamento selecionada.
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
   * @param opcao Opção de pagamento selecionada.
   */
  prosseguir(opcao: FormaPagamento): void {
    // by Ryuge 29/11/2018
    // edit by Helio 27/03/2020
    if (opcao.parcelas) {
      this.navControl.navigateForward(['/formas-pagamento/parcelamento']);
    } else {
      this.navControl.navigateRoot(['/pedido-finalizacao']);
    }
  }
}
