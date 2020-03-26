import { Component, OnInit, ViewChild } from '@angular/core';
import { CondicaoPagamentoService } from 'src/app/services/pagamento/condicao-pagamento.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.page.html',
  styleUrls: ['./formas-pagamento.page.scss'],
})
export class FormasPagamentoPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  public opcoesPagamento: any[] = [];

  constructor(
    public common: CommonService,
    private pedido: PedidoService,
    private pagamento: CondicaoPagamentoService
  ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.pagamento.getFormaPagamento(this.pedido.numPedido).then((result: any) => {
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

}
