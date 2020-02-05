import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tinta-alterada',
  templateUrl: './tinta-alterada.page.html',
  styleUrls: [
    './styles/tinta-alterada.page.scss',
    './styles/tinta-alterada-desktop.page.scss'
  ],
})
export class TintaAlteradaPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  fors: any = [{a: 'cA', b: 'cA'}, {a: 'cB', b: 'cB'}, {a: 'cC', b: 'cC'}, {a: 'cA', b: 'cA'}, {a: 'cB', b: 'cB'}, {a: 'cC', b: 'cC'}, {a: 'cA', b: 'cA'}]

  showFooter: boolean = false;

  constructor() { }

  ngOnInit() {
    this.slides.lockSwipes(true)
  }

  mudaSlide(event: any) {
    this.slides.lockSwipes(false)
    this.slides.slideTo(event.detail.value)
    this.slides.lockSwipes(true)
  }

  scrollOnFocus() {
    console.log("scroll")
    this.content.scrollToTop()
  }

}
