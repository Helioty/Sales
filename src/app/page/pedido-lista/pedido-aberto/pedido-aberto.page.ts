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
  selector: 'app-pedido-aberto',
  templateUrl: './pedido-aberto.page.html',
  styleUrls: ['./pedido-aberto.page.scss'],
})
export class PedidoAbertoPage implements OnInit {
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
    console.log('Pedidos em aberto OnInit');
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
    this.getPedidosEmAberto(this.paginaAtual, event);
  }

  /**
   * @author helio.souza
   * @param refresher IonRefresher Element.
   */
  doRefresh(target: any): void {
    const refresher = target as IonRefresher;
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
    this.getPedidosEmAberto(1, event);
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinit: any): void {
    const infinite = infinit as IonInfiniteScroll;
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
    this.getPedidosEmAberto(this.paginaAtual + 1, event);
  }

  /**
   * @author helio.souza
   * @param page
   */
  getPedidosEmAberto(
    page: number,
    event = (data: Pagination<PedidoHeader> | null) => {}
  ): void {
    this.pedidoListaService.getPedidos('abertos', page).subscribe({
      next: (result) => {
        console.log(result);
        event(result);
      },
      error: () => {
        event(null);
      },
    });
  }

  openSlide(itemSlide: IonItemSliding): void {
    itemSlide.open('end');
  }

  closeSlide(itemSlide: IonItemSliding): void {
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
}
