import { Component, OnInit } from '@angular/core';
import { IonItem, IonItemSliding, AlertController } from '@ionic/angular';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/config/app.config';

import { BaseCommon } from './../../../commons/base-common';
import { BaseService } from '../../../commons/services/base-service.service';


@Component({
  selector: 'app-pedido-aberto',
  templateUrl: './pedido-aberto.page.html',
  styleUrls: ['./pedido-aberto.page.scss'],
})
export class PedidoAbertoPage implements OnInit {

  public pedidos: any[];

  public itemSlidingAberto: any;
  public itemAberto: any;
  public task: any;
  public taskFlag: boolean;

  constructor(
    public baseService: BaseService,
    public common: BaseCommon,
    private alertCtrl: AlertController
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

  async getPedidosEmAberto(page: number) {
    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/list/" + localStorage.getItem("empresa") + "/abertos?page=" + page;
    await this.baseService.get(link).then((result: any) => {
      console.log(result)
      this.pedidos = result.content;
      console.log(this.pedidos)
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
            console.log("Cancelado");
          }
        }
      ]
    })
    await alert.present();
  }

  async removePedido(pedidoId: any) {
    this.common.showLoader()
    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/" + localStorage.getItem("empresa") + "/" + pedidoId;

    this.baseService.post(link, {})
      .then((result: any) => {
        console.log(result)
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

  alterarPedido(pedido: any) {

  }




}
