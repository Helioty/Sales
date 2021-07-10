import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import {
  AlertController,
  IonInfiniteScroll,
  IonItemSliding,
  NavController,
} from '@ionic/angular';
import { take } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoManutencaoService } from 'src/app/services/pedido/pedido-manutencao.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { Pagination } from './../pedido-lista.interface';
import { PedidoListaService } from './../pedido-lista.service';

@Component({
  selector: 'app-pedido-aberto',
  templateUrl: './pedido-aberto.page.html',
  styleUrls: ['./pedido-aberto.page.scss'],
})
export class PedidoAbertoPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  data: Pagination<PedidoHeader>;

  public resultGetPedidos: any;
  public pedidos: any[] = [];

  public showSkeleton = false;

  public paginaAtual = 1;
  public totalPagina = 0;
  public lastPage = false;

  constructor(
    public common: CommonService,
    private alertCtrl: AlertController,
    private navControl: NavController,
    private pedidoListaService: PedidoListaService,
    private pedidoManutencaoService: PedidoManutencaoService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  ionViewDidEnter() {
    this.showSkeleton = true;
    this.getPedidosEmAberto(1);
  }

  async doRefresh(event: any) {
    this.paginaAtual = 1;
    // await this.getPedidosEmAberto(this.paginaAtual).then(
    //   (res) => {
    //     event.target.complete();
    //   },
    //   (error) => {
    //     console.log(error);
    //     event.target.complete();
    //   }
    // );
  }

  async doInfinite(event: any) {
    // try {
    //   if (!this.lastPage) {
    //     await this.getPedidosEmAberto(this.paginaAtual).then((res) => {
    //       event.target.complete();
    //       if (this.paginaAtual >= this.totalPagina) {
    //         this.infiniteScroll.disabled = true;
    //       }
    //     });
    //   } else {
    //     event.target.complete();
    //     if (this.paginaAtual >= this.totalPagina) {
    //       this.infiniteScroll.disabled = true;
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  getPedidosEmAberto(page: number): void {
    if (page === 1) {
      this.lastPage = false;
    }
    this.pedidoListaService
      .getPedidosEmAberto(page)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.data = result;
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
        },
        error: (error: any) => {
          console.log(error);
        },
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
        pedido: JSON.stringify(pedido),
      },
      skipLocationChange: true,
    };
    this.navControl.navigateForward(['/pedido-resumo'], navigationExtras);
  }

  async apagarPedido(pedido: any) {
    const alert = await this.alertCtrl.create({
      header: 'ATENÇÃO!',
      message:
        'Tem certeza? Apagando um pedido, os dados inseridos não poderão ser recuperados.',
      buttons: [
        {
          text: 'Voltar',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'APAGAR',
          handler: () => {
            this.removePedido(pedido.numpedido);
          },
        },
      ],
    });
    await alert.present();
  }

  async removePedido(pedidoId: any) {
    // this.common.showLoader()
    // const link =
    //   ENV.WS_VENDAS +
    //   API_URL +
    //   'PedidoVenda/' +
    //   localStorage.getItem('empresa') +
    //   '/' +
    //   pedidoId;
    // this.baseService.post(link, {}).then(
    //   (result: any) => {
    //     console.log(result);
    //     this.common.showToast(result.msg);
    //     this.getPedidosEmAberto(1);
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.common.loading.dismiss();
    //   }
    // );
  }

  alterarPedido(pedido: any) {
    this.pedidoManutencaoService.reabrirPedido(pedido);
  }
}
