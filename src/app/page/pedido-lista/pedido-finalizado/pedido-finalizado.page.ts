import { Component, OnInit } from '@angular/core';
import { IonItemSliding, AlertController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/config/app.config';

import { BaseCommon } from '../../../../commons/base-common';
import { BaseService } from '../../../services/base-service.service';


@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.page.html',
  styleUrls: ['./pedido-finalizado.page.scss'],
})
export class PedidoFinalizadoPage implements OnInit {

  public resultGetPedidos: any;
  public pedidos: any[] = [];

  public showSkeleton: boolean = false;

  constructor(
    public baseService: BaseService,
    public common: BaseCommon,
    private alertCtrl: AlertController,
    private navControl: NavController,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.getPedidosEmAberto(1)
  }

  async doRefresh(event: any) {
    try {
      await this.getPedidosEmAberto(1).then(res => {
        event.target.complete();
      })
    } catch (error) {
      console.log(error)
    }
  }

  async doInfinite(event: any) {
    try {
      await this.getPedidosEmAberto(1).then(res => {
        event.target.complete();
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getPedidosEmAberto(page: number) {
    this.showSkeleton = true;
    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/list/" + localStorage.getItem("empresa") + "/faturados?page=" + page;
    await this.baseService.get(link).then((result: any) => {
      console.log(result)
      this.resultGetPedidos = result;
      this.pedidos = result.content;
      if (this.pedidos.length == 0) {
        console.log("Nenhum pedido em aberto")
        this.pedidos = null;
      }
      console.log(this.pedidos)
      this.showSkeleton = false;
    }), (error: any) => {
      console.log(error)
    }

  }

  openSlide(itemSlide: IonItemSliding) {
    itemSlide.open('end');
  }

  closeSlide(itemSlide: IonItemSliding) {
    itemSlide.close()
  }

  verProdutosPedido(pedido: any) {
    this.navControl.navigateForward("/pedido-resumo", pedido)
  }

  async apagarPedido(pedido: any) {
    const alert = await this.alertCtrl.create({
      header: "ATENÇÃO!",
      message: "Tem certeza? Apagando um pedido, os dados inseridos não poderão ser recuperados.",
      buttons: [
        {
          text: "Voltar",
          handler: () => {
            console.log("Cancelado");
          }
        },
        {
          text: "APAGAR",
          handler: () => {
            this.removePedido(pedido.numpedido);
            this.getPedidosEmAberto(1)
          }
        }
      ]
    })
    await alert.present();
  }

  async removePedido(pedidoId: any) {
    // this.common.showLoader()
    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/" + localStorage.getItem("empresa") + "/" + pedidoId;

    this.baseService.post(link, {})
      .then((result: any) => {
        console.log(result)
        this.common.showToast(result.msg)
        this.getPedidosEmAberto(1)
      })
      .catch(error => {
        this.common.loading.dismiss()
        try {
          this.common.showAlert(error.json().title, error.json().detail)
        } catch (err) {
          console.log(err);
        }
      })
  }

}
