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

  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    private pagamento: CondicaoPagamentoService,
    private navControl: NavController
  ) { }

  ngOnInit() {
  }

}
