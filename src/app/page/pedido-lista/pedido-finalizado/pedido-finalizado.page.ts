import { Component, OnInit, ViewChild } from '@angular/core';
import { IonItemSliding, AlertController, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';

import { CommonService } from 'src/app/services/common/common.service';
import { BaseService } from '../../../services/base-service.service';

import { PedidoListaPage } from '../pedido-lista.page';


@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.page.html',
  styleUrls: ['./pedido-finalizado.page.scss'],
})
export class PedidoFinalizadoPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  public resultGetPedidos: any;
  public pedidos: any[] = [];

  public showSkeleton: boolean = false;

  public paginaAtual: number = 1;
  public totalPagina: number = 0;
  public lastPage: boolean = false;

  constructor(
    public baseService: BaseService,
    public common: CommonService,
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
    this.getPedidosFinalizados(1);
  }

  async doRefresh(event: any) {
    try {
      this.paginaAtual = 1;
      await this.getPedidosFinalizados(this.paginaAtual).then(res => {
        event.target.complete();
      })
    } catch (error) {
      console.log(error)
    }
  }

  async doInfinite(event: any) {
    try {
      if (!this.lastPage) {
        await this.getPedidosFinalizados(this.paginaAtual).then(res => {
          event.target.complete();
          if (this.paginaAtual >= this.totalPagina) {
            this.infiniteScroll.disabled = true;
          }
        });
      }
      else {
        event.target.complete();
        if (this.paginaAtual >= this.totalPagina) {
          this.infiniteScroll.disabled = true;
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getPedidosFinalizados(page: number) {
    if (page == 1) {
      this.lastPage = false;
    }
    await this.pedidoLista.getPedidosFinalizados(page).then((result: any) => {
      console.log(result);
      this.resultGetPedidos = result;
      this.pedidos = result.content;
      this.totalPagina = this.resultGetPedidos.totalPages;
      this.paginaAtual = page + 1;
      this.lastPage = this.resultGetPedidos.last;
      if (this.pedidos.length == 0) {
        console.log("Nenhum pedido em finalizado")
        this.pedidos = null;
      }
      console.log(this.pedidos);
      this.showSkeleton = false;
    }), (error: any) => {
      this.pedidoLista.showError(error);
    }
  }

  openSlide(itemSlide: IonItemSliding) {
    itemSlide.open('end');
  }

  closeSlide(itemSlide: IonItemSliding) {
    itemSlide.close();
  }

  verProdutosPedido(pedido: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        pedido: JSON.stringify(pedido)
      },
      skipLocationChange: true
    };
    this.navControl.navigateForward(["/pedido-resumo"], navigationExtras);
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
          }
        }
      ]
    })
    await alert.present();
  }

  async removePedido(pedidoId: any) {
    // this.common.showLoader()
    let link: string = ENV.WS_VENDAS + API_URL + "PedidoVenda/" + localStorage.getItem("empresa") + "/" + pedidoId;

    this.baseService.post(link, {}).then((result: any) => {
      console.log(result);
      this.common.showToast(result.msg);
      this.getPedidosFinalizados(1);
    }, (error) => {
      this.common.loading.dismiss();
      this.pedidoLista.showError(error);
    });
  }

  alterarPedido(pedido: any) {

  }

}
