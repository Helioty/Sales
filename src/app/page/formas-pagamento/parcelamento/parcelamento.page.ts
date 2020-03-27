import { Component, OnInit } from '@angular/core';
import { CondicaoPagamentoService } from 'src/app/services/pagamento/condicao-pagamento.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-parcelamento',
  templateUrl: './parcelamento.page.html',
  styleUrls: ['./parcelamento.page.scss'],
})
export class ParcelamentoPage implements OnInit {
  public opcoesList: any[] = [];

  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    private pagamento: CondicaoPagamentoService,
    private navControl: NavController
  ) { }

  async ngOnInit() {
    await this.common.showLoader();
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.pagamento.getCondicaoPagamento(this.pedido.pedidoHeader.tipodoc, this.pedido.numPedido)
      .then((result: any) => {
        console.log(result);
        this.common.loading.dismiss();
      }, (error) => {
        this.common.loading.dismiss();
      });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

}
