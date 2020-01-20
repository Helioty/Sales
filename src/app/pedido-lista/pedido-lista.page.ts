import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

@Component({
  selector: 'app-pedido-lista',
  templateUrl: './pedido-lista.page.html',
  styleUrls: ['./pedido-lista.page.scss'],
})
export class PedidoListaPage implements OnInit {

  constructor(
    private androidFullScreen: AndroidFullScreen,
    private menu: MenuController,
    private navControl: NavController,
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.menu.enable(true);
    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));
  }


  novoPedido() {
    this.navControl.navigateForward('/produto')
  }

}
