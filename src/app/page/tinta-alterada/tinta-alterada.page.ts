import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { BaseCommon } from 'src/commons/base-common';

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

  constructor(
    public common: BaseCommon,
    private navControl: NavController,
  ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.common.goToFullScreen()
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.common.goToFullScreen()
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

  listaTintas(list: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        tintas: JSON.stringify(list)
      },
      skipLocationChange: true
    };
    this.navControl.navigateForward(["/lista-tintas"], navigationExtras)
  }

}
