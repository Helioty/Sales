import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { BaseCommon } from 'src/commons/base-common';
import { PedidoService } from 'src/app/services/pedido-service.service';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;

  constructor(
    public alertCtrl: AlertController,
    public common: BaseCommon,
    private navControl: NavController,
    public pedidoService: PedidoService,
    private platform: Platform
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.focusOn()
    this.common.goToFullScreen()
  }

  ionViewDidEnter() {
    this.common.goToFullScreen()
  }

  ionViewWillLeave() {
    this.focusOff()
  }

  ionViewDidLeave() {

  }

  focusOn() {
    if (this.platform.is("cordova")) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = "";
          document.getElementById("scanner").focus();
        } catch (error) { }
      }, 300);
    }
  }

  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 500);
  }

  testeScanner(evento: any) {
    console.log(evento);
    this.common.showAlertInfo(evento.target.value);
  }

  async scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusOff();
        let codigo: string = evento.target.value;

        if (codigo.substring(0, 1) == "P") {
          this.pedidoService.setCardPedido(codigo);
          this.focusOn();
        } else {

        }
      }
    } catch (error) {
      this.focusOn();
    }
  }

  async sairPedido() {
    const alert = await this.alertCtrl.create({
      // header: "Logout",
      subHeader: "Deseja sair do pedido?",
      buttons: ['NÃO', {
        text: 'SIM',
        handler: () => {
          this.pedidoService.limpaDadosPedido()
          this.navControl.navigateRoot('/pedido-lista')
        }
      }]
    });
    await alert.present();
  }

}
