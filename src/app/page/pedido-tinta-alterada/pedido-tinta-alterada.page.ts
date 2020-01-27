import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-pedido-tinta-alterada',
  templateUrl: './pedido-tinta-alterada.page.html',
  styleUrls: ['./pedido-tinta-alterada.page.scss'],
})
export class PedidoTintaAlteradaPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  constructor() { }

  ngOnInit() {
    this.slides.lockSwipes(true)
  }

  console(event: any) {
    console.log(event)
    console.log(event.detail.value)
    this.slides.lockSwipes(false)
    this.slides.slideTo(event.detail.value)
    this.slides.lockSwipes(true)
  }
}
