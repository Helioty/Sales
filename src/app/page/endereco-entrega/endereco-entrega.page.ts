import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-endereco-entrega',
  templateUrl: './endereco-entrega.page.html',
  styleUrls: ['./endereco-entrega.page.scss'],
})
export class EnderecoEntregaPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private common: CommonService,
    public pedidoService: PedidoService,
    private navControl: NavController
  ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
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

  changeSlide(slide: number) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
  }

  async prosseguir() {
    let paginaSeguinte: any;
    this.activatedRoute.queryParams.subscribe((params: any) => {
      paginaSeguinte = params.paginaSeguinte;
    });
    switch (paginaSeguinte) {
      case 'back':
        this.navControl.pop();
        break;

      case 'pedido-atalhos':
        this.navControl.navigateRoot(['/' + paginaSeguinte]);
        break;

      default:
        this.navControl.navigateForward(['/' + paginaSeguinte]);
        break;
    }
  }

}
