import { Component, OnInit, ViewChild } from '@angular/core';
import { IonItemSliding, AlertController, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';

import { CommonService } from 'src/app/services/common/common.service';
import { BaseService } from '../../../services/base-service.service';

import { PedidoListaPage } from '../pedido-lista.page';
import { PedidoManutencaoService } from 'src/app/services/pedido/pedido-manutencao.service';


@Component({
  selector: 'app-pedido-aberto',
  templateUrl: './pedido-aberto.page.html',
  styleUrls: ['./pedido-aberto.page.scss'],
})
export class PedidoAbertoPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  public resultGetPedidos: any;
  public pedidos: any[] = [];

  public showSkeleton = false;

  public paginaAtual = 1;
  public totalPagina = 0;
  public lastPage = false;

  constructor(
    public baseService: BaseService,
    public common: CommonService,
    private alertCtrl: AlertController,
    private navControl: NavController,
    private pedidoLista: PedidoListaPage,
    private pedidoManutencaoService: PedidoManutencaoService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {
    this.showSkeleton = true;
    this.getPedidosEmAberto(1);
  }

  async doRefresh(event: any) {
    this.paginaAtual = 1;
    await this.getPedidosEmAberto(this.paginaAtual).then(res => {
      event.target.complete();
    }, (error) => {
      console.log(error);
      event.target.complete();
    });
  }

  async doInfinite(event: any) {
    try {
      if (!this.lastPage) {
        await this.getPedidosEmAberto(this.paginaAtual).then(res => {
          event.target.complete();
          if (this.paginaAtual >= this.totalPagina) {
            this.infiniteScroll.disabled = true;
          }
        });
      } else {
        event.target.complete();
        if (this.paginaAtual >= this.totalPagina) {
          this.infiniteScroll.disabled = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getPedidosEmAberto(page: number) {
    if (page === 1) {
      this.lastPage = false;
    }
    await this.pedidoLista.getPedidosEmAberto(page).then((result: any) => {
      console.log(result);
      this.resultGetPedidos = result;
      this.pedidos = result.content;
      this.totalPagina = this.resultGetPedidos.totalPages;
      this.paginaAtual = page + 1;
      this.lastPage = this.resultGetPedidos.last;
      if (this.pedidos.length === 0) {
        console.log('Nenhum pedido em aberto');
        this.pedidos = null;
      }
      console.log(this.pedidos);
      this.showSkeleton = false;
    }, (error: any) => {
      console.log(error);
    });
  }

  openSlide(itemSlide: IonItemSliding) {
    itemSlide.open('end');
  }

  closeSlide(itemSlide: IonItemSliding) {
    itemSlide.close();
  }

  verProdutosPedido(pedido: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pedido: JSON.stringify(pedido)
      },
      skipLocationChange: true
    };
    this.navControl.navigateForward(['/pedido-resumo'], navigationExtras);
  }

  async apagarPedido(pedido: any) {
    const alert = await this.alertCtrl.create({
      header: 'ATENÇÃO!',
      message: 'Tem certeza? Apagando um pedido, os dados inseridos não poderão ser recuperados.',
      buttons: [
        {
          text: 'Voltar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'APAGAR',
          handler: () => {
            this.removePedido(pedido.numpedido);
          }
        }
      ]
    });
    await alert.present();
  }

  async removePedido(pedidoId: any) {
    // this.common.showLoader()
    const link: string = ENV.WS_VENDAS + API_URL + 'PedidoVenda/' + localStorage.getItem('empresa') + '/' + pedidoId;

    this.baseService.post(link, {}).then((result: any) => {
      console.log(result);
      this.common.showToast(result.msg);
      this.getPedidosEmAberto(1);
    }, (error) => {
      console.log(error);
      this.common.loading.dismiss();
    });
  }

  alterarPedido(pedido: any) {
    this.pedidoManutencaoService.reabrirPedido(pedido);
  }

}
