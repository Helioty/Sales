import { Component, OnInit, ViewChild } from '@angular/core';
import { IonItemSliding, AlertController, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';

import { BaseCommon } from '../../../../commons/base-common';
import { BaseService } from '../../../services/base-service.service';

import { PedidoListaPage } from '../pedido-lista.page';


@Component({
  selector: 'app-pedido-aberto',
  templateUrl: './pedido-aberto.page.html',
  styleUrls: ['./pedido-aberto.page.scss'],
})
export class PedidoAbertoPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  public resultGetPedidos: any;
  public pedidos: any[] = [];

  public showSkeleton: boolean = false;

  public paginaAtual: number = 1;
  public totalPagina: number = 0;

  constructor(
    public baseService: BaseService,
    public common: BaseCommon,
    private alertCtrl: AlertController,
    private navControl: NavController,
    private pedidoLista: PedidoListaPage,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    
  }

  ionViewDidEnter() {
    this.showSkeleton = true;
    this.getPedidosEmAberto(1)
  }

  async doRefresh(event: any) {
    try {
      this.paginaAtual = 1;
      await this.getPedidosEmAberto(this.paginaAtual).then(res => {
        event.target.complete();
      })
    } catch (error) {
      console.log(error)
    }
  }

  async doInfinite(event: any) {
    try {
      await this.getPedidosEmAberto(this.paginaAtual).then(res => {
        event.target.complete();

        if (this.paginaAtual >= this.totalPagina) {
          this.infiniteScroll.disabled = true;
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getPedidosEmAberto(page: number) {
    this.pedidoLista.getPedidosEmAberto(page).then((result: any) => {
      console.log(result)
      this.resultGetPedidos = result;
      this.pedidos = result.content;
      this.totalPagina = this.resultGetPedidos.totalPages;
      if (this.pedidos.length == 0) {
        console.log("Nenhum pedido em aberto")
        this.pedidos = null;
      }
      console.log(this.pedidos)
      this.showSkeleton = false;
    }), (error: any) => {
      this.common.showAlert(error.title, error.detail);
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
    let navigationExtras: NavigationExtras = {
      queryParams: {
        pedido: JSON.stringify(pedido)
      },
      skipLocationChange: true
    };
    this.navControl.navigateForward(["/pedido-resumo"], navigationExtras)
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

  alterarPedido(pedido: any) {

  }




}
