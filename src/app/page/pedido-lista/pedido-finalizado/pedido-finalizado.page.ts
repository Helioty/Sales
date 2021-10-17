import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import {
  IonInfiniteScroll,
  IonItemSliding,
  IonRefresher,
  NavController,
} from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { Pagination } from './../pedido-lista.interface';
import { PedidoListaService } from './../pedido-lista.service';

@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.page.html',
  styleUrls: ['./pedido-finalizado.page.scss'],
})
export class PedidoFinalizadoPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  data: Pagination<PedidoHeader>;
  public showSkeleton = false;
  private paginaAtual = 1;

  constructor(
    private readonly common: CommonService,
    private readonly navControl: NavController,
    private readonly pedidoService: PedidoService,
    private readonly pedidoListaService: PedidoListaService
  ) {}

  ngOnInit(): void {
    console.log('Pedidos finalizados OnInit');
  }

  ionViewWillEnter(): void {
    this.showSkeleton = true;
  }

  ionViewDidEnter(): void {
    this.doInit();
  }

  /**
   * @author helio.souza
   */
  doInit(): void {
    const event = (data: Pagination<PedidoHeader> | null) => {
      if (data) {
        this.data = data;
        this.infiniteScroll.disabled = this.data.last;
        this.showSkeleton = false;
      } else {
        this.showSkeleton = false;
      }
    };
    this.getPedidosFinalizados(this.paginaAtual, event);
  }

  /**
   * @author helio.souza
   * @param refresher IonRefresher Element.
   */
  doRefresh(refresher: IonRefresher): void {
    const event = (data: Pagination<PedidoHeader> | null) => {
      if (data) {
        this.paginaAtual = 1;
        this.data = data;
        this.infiniteScroll.disabled = this.data.last;
        refresher.complete();
      } else {
        refresher.complete();
      }
    };
    this.getPedidosFinalizados(1, event);
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinite: IonInfiniteScroll): void {
    const event = (data: Pagination<PedidoHeader> | null) => {
      if (data) {
        this.paginaAtual = this.paginaAtual + 1;
        data.content = this.data.content.concat(data.content);
        this.data = data;
        infinite.complete();
        this.infiniteScroll.disabled = this.data.last;
      } else {
        infinite.complete();
      }
    };
    this.getPedidosFinalizados(this.paginaAtual + 1, event);
  }

  /**
   * @author helio.souza
   * @param page
   */
  getPedidosFinalizados(
    page: number,
    event = (data: Pagination<PedidoHeader> | null) => {}
  ): void {
    this.pedidoListaService.getPedidos('faturados', page).subscribe({
      next: (result) => {
        console.log(result);
        event(result);
      },
      error: () => {
        event(null);
      },
    });
  }

  openSlide(itemSlide: IonItemSliding) {
    itemSlide.open('end');
  }

  closeSlide(itemSlide: IonItemSliding) {
    itemSlide.close();
  }

  /**
   * @author helio.souza
   * @param pedido Dados do Pedido.
   */
  verProdutosPedido(pedido: PedidoHeader): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pedido: JSON.stringify(pedido),
      },
      skipLocationChange: true,
    };
    this.navControl.navigateForward(['pedido-lista/pedido-resumo'], navigationExtras);
  }

  /**
   * @author helio.souza
   * @param pedido Pedido.
   * @param index Index do Pedido na Lista.
   */
  apagarPedido(pedido: PedidoHeader, index: number): void {
    const props = {
      titulo: 'ATENÇÃO!',
      message: `Tem certeza? Apagando um pedido, os dados inseridos não poderão ser recuperados.`,
      handler: () => {
        this.pedidoService.apagarPedido(pedido.numpedido).subscribe({
          next: () => {
            this.data.content.splice(index, 1);
            this.common.showToast('Pedido excluido!');
          },
        });
      },
    };
    this.common.showAlertAction(props);
  }

  /**
   * @author helio.souza
   * @param pedido Dados do Pedido.
   */
  alterarPedido(pedido: PedidoHeader): void {
    this.pedidoService.reabrirPedido(pedido);
  }

  /**
   * @author helio.souza
   * @param pedido Dados do Pedido.
   */
  ajustarPedido(pedido: PedidoHeader): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pedido: JSON.stringify(pedido),
      },
      skipLocationChange: true,
    };
    this.navControl.navigateForward(['pedido-lista/pedido-desconto'], navigationExtras);
  }
}
