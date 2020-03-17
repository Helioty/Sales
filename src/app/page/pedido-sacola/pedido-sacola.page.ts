import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pedido-sacola',
  templateUrl: './pedido-sacola.page.html',
  styleUrls: ['./pedido-sacola.page.scss'],
})
export class PedidoSacolaPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus: boolean = true;

  public itens: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    public common: CommonService,
    public pedidoService: PedidoService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    await this.pedidoService.getItemPedido().then((result: any) => {
      this.itens = result.content;
      console.log(result);
    });
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
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) == "P") {
          this.pedidoService.setCardPedido(codigo);
          this.focusPlay();
        } else {
          this.focusPlay();
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
    alert.onDidDismiss().finally(() => { this.focusPlay(); });
    await alert.present().then(()=>{
      this.focusPause();
    });
  }

  async openClientePage() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-sacola'
      }
    };
    this.navControl.navigateForward(["/cliente"], navigationExtras);
  }
  
}
