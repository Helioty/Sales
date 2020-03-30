import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-pedido-finalizacao',
  templateUrl: './pedido-finalizacao.page.html',
  styleUrls: ['./pedido-finalizacao.page.scss'],
})
export class PedidoFinalizacaoPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;

  // Exibição
  public numeroPedido: string;
  public totalProdutos: any;
  public totalPedido: any;

  // Produtos
  public itens: any[] = [];


  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.focusOn();
    this.common.goToFullScreen();
    this.numeroPedido =
      this.pedido.pedidoHeader.numpedido + '-' +
      this.pedido.pedidoHeader.digito.toString();

    // by Ryuge 12/12/2018
    this.totalProdutos =
      this.pedido.pedidoHeader.totpedido - this.pedido.pedidoHeader.frete.valor +
      this.pedido.pedidoHeader.descontoBrinde + this.pedido.pedidoHeader.valorDesconto;

    this.totalPedido = this.pedido.pedidoHeader.valorTotalPedido;
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.focusOff();
  }

  ionViewDidLeave() {
    console.clear();
  }

  // Cria o loop que da foco no input
  focusOn() {
    if (this.platform.is('cordova')) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = '';
          if (this.focusStatus) {
            document.getElementById('scanner').focus();
          }
        } catch (error) { }
      }, 300);
    }
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    document.getElementById('scanner').blur();
  }

  // Encerra o loop de foco no input
  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 150);
  }

}
