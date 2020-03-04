import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus: boolean = true;

  constructor(
    public alertCtrl: AlertController,
    public common: CommonService,
    public pedidoService: PedidoService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.focusOn();
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.focusOff();
  }

  ionViewDidLeave() {

  }

  // Cria o loop que da foco no input
  focusOn() {
    if (this.platform.is("cordova")) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = "";
          if (this.focusStatus) {
            document.getElementById("scanner").focus();
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
  }

  // Encerra o loop de foco no input
  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 150);
  }

  async scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        let codigo: string = evento.target.value;

        if (codigo.substring(0, 1) == "P") {
          this.pedidoService.setCardPedido(codigo);
          this.focusPlay();
        } else {

        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }

  async adicionarCartaoPedido() {
    const alert = await this.alertCtrl.create({
      header: "Cartão Pedido",
      cssClass: 'ion-alert-input',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Digite o codigo do cartão!'
        }
      ],
      buttons: ['CANCELAR', {
        text: 'ADICIONAR',
        handler: (data: any) => {
          this.pedidoService.setCardPedido(data.codigo);
        }
      }]
    });
    alert.onDidDismiss().finally(() => { this.focusPlay() });
    await alert.present().then(()=>{
      this.focusPause();
    });
  }

  async openClientePage() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto-pesquisa'
      }
    };
    this.navControl.navigateForward(["/cliente"], navigationExtras);
  }

}
