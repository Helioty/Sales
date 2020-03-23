import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-endereco-entrega',
  templateUrl: './endereco-entrega.page.html',
  styleUrls: ['./endereco-entrega.page.scss'],
})
export class EnderecoEntregaPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private common: CommonService,
    public pedidoService: PedidoService,
    private navControl: NavController
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

}
