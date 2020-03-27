import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pedido-finalizacao',
  templateUrl: './pedido-finalizacao.page.html',
  styleUrls: ['./pedido-finalizacao.page.scss'],
})
export class PedidoFinalizacaoPage implements OnInit {

  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    private navControl: NavController
  ) { }

  ngOnInit() {

  }

}
