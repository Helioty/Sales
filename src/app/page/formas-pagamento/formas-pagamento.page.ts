import { Component, OnInit } from '@angular/core';
import { CondicaoPagamentoService } from 'src/app/services/pagamento/condicao-pagamento.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.page.html',
  styleUrls: ['./formas-pagamento.page.scss'],
})
export class FormasPagamentoPage implements OnInit {
  public opcoesPagamento: any[] = [];

  constructor(
    public common: CommonService,
    private pedido: PedidoService,
    private pagamento: CondicaoPagamentoService,
    private navControl: NavController
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.pagamento.getFormaPagamento(this.pedido.numPedido).then((result: any) => {
      this.opcoesPagamento = result;
      console.log(result);
    });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

  async goToCondicaoPagamento(opcaoPagamento: any) {
    await this.common.showLoader();
    this.pagamento.setTipoPagamento(opcaoPagamento.codigo).then((result: any) => {
      this.prosseguir(opcaoPagamento);
      this.common.loading.dismiss();
      console.log(result);
    }, (error) => {
      this.common.loading.dismiss();
    });
  }

  prosseguir(opcao: any) {
    // by Ryuge 29/11/2018
    // edit by Helio 27/03/2020
    if (opcao.parcelas !== 0) {
      this.navControl.navigateForward(['/parcelamento']);
    } else {
      this.navControl.navigateRoot(['/pedido-finalizacao']);
    }
  }

}
