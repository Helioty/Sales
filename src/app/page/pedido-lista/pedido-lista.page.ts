import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/config/app.config';

import { BaseService } from 'src/app/services/base-service.service';

@Component({
  selector: 'app-pedido-lista',
  templateUrl: './pedido-lista.page.html',
  styleUrls: ['./pedido-lista.page.scss'],
})
export class PedidoListaPage implements OnInit {

  public totalEmAberto: number = 0;
  public totalFinalizados: number = 0;

  constructor(
    private androidFullScreen: AndroidFullScreen,
    private menu: MenuController,
    private navControl: NavController,
    public baseService: BaseService,
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
    this.navControl.navigateForward('/pedido-sacola')
  }

  checaAtivo(id: string, id2: string) {
    // console.log("A")
    // let elemento = document.getElementById(id);
    // let classes = elemento.className.split(' ');
    // let getIndex = classes.indexOf("fab-button-close-active");

    // let elemento2 = document.getElementById(id2);
    // let classes2 = elemento2.className.split(' ');
    // let getIndex2 = classes2.indexOf("contentOpaco");

    // if (getIndex === -1) {
    //   classes.push("contentOpaco");
    //   elemento2.className = classes.join(' ');
    // }
    // else {
    //   classes2.splice(getIndex2, 1);
    //   elemento2.className = classes.join(' ');
    // }
  }

  async getPedidosEmAberto(page: number) {
    if (page > 1) {
      let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/list/" + localStorage.getItem("empresa") + "/abertos";
      return await this.baseService.get(link)
    }
    else {
      let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/list/" + localStorage.getItem("empresa") + "/abertos?page=" + page;
      return await this.baseService.get(link)
    }
  }

  async getPedidosFinalizados(page: number) {
    if (page > 1) {
      let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/list/" + localStorage.getItem("empresa") + "/faturados";
      return await this.baseService.get(link)
    }
    else {
      let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/list/" + localStorage.getItem("empresa") + "/faturados?page=" + page;
      return await this.baseService.get(link)
    }
  }


}
