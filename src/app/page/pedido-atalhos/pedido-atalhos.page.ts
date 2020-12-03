import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform, IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pedido-atalhos',
  templateUrl: './pedido-atalhos.page.html',
  styleUrls: ['./pedido-atalhos.page.scss'],
})
export class PedidoAtalhosPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;

  constructor(
    private alertCtrl: AlertController,
    public common: CommonService,
    public pedidoService: PedidoService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
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
    this.taskScanner = setInterval(() => {
      try {
        this.valorScanner = '';
        if (this.focusStatus) {
          const scanners = document.body.getElementsByClassName('scanner');
          for (const i in scanners) {
            if (Number(i) === (scanners.length - 1)) {
              (scanners[i] as HTMLInputElement).focus();
            }
          }
        }
      } catch (error) { }
    }, 350);
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    const scanners = document.body.getElementsByClassName('scanner');
    for (const i in scanners) {
      if (Number(i) === (scanners.length - 1)) {
        (scanners[i] as HTMLInputElement).blur();
      }
    }
  }

  // Encerra o loop de foco no input
  focusOff() {
    clearInterval(this.taskScanner);
  }

  scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
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
      header: 'Cartão Pedido',
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
    await alert.present().then(() => {
      this.focusPause();
    });
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto-atalhos'
      }
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

}
