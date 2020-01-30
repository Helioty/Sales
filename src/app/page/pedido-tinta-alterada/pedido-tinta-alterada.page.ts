import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-pedido-tinta-alterada',
  templateUrl: './pedido-tinta-alterada.page.html',
  styleUrls: ['./pedido-tinta-alterada.page.scss'],
})
export class PedidoTintaAlteradaPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  fors: any = [{a: 'cA', b: 'cA'}, {a: 'cB', b: 'cB'}, {a: 'cC', b: 'cC'}, {a: 'cA', b: 'cA'}, {a: 'cB', b: 'cB'}, {a: 'cC', b: 'cC'}, {a: 'cA', b: 'cA'}]

  showFooter: boolean = false;

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

  scrollOnFocus() {
    console.log("scroll")
    this.content.scrollToTop()
  }

}
