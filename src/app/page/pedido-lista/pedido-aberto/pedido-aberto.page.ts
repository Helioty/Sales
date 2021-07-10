import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import {
  IonInfiniteScroll,
  IonItemSliding,
  IonRefresher,
  NavController,
} from '@ionic/angular';
import { take } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoManutencaoService } from 'src/app/services/pedido/pedido-manutencao.service';
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
    private readonly pedidoListaService: PedidoListaService,
    private readonly pedidoManutencaoService: PedidoManutencaoService
  ) {}

  ngOnInit(): void {
    console.log('Pedidos em aberto OnInit');
  }

  ionViewWillEnter(): void {
    this.showSkeleton = true;
  }

  ionViewDidEnter(): void {
    this.getPedidosEmAberto(this.paginaAtual);
  }

  /**
   * @author helio.souza
   * @param refresher IonRefresher Element.
   */
  doRefresh(refresher: IonRefresher): void {
    this.paginaAtual = 1;
    this.pedidoListaService
      .getPedidosEmAberto(this.paginaAtual)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          console.log(result);
          this.atualizaData(result);
          refresher.complete();
        },
        error: () => {
          refresher.complete();
        },
      });
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinite: IonInfiniteScroll): void {
    this.pedidoListaService
      .getPedidosEmAberto(this.paginaAtual + 1)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          console.log(result);
          this.paginaAtual = this.paginaAtual + 1;
          this.atualizaData(result);
          infinite.complete();
        },
        error: () => {
          infinite.complete();
        },
      });
  }

  /**
   * @author helio.souza
   * @param page
   */
  getPedidosEmAberto(page: number): void {
    this.pedidoListaService
      .getPedidosEmAberto(page)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          console.log(result);
          this.atualizaData(result);
          this.paginaAtual = page;
          this.showSkeleton = false;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  /**
   * @author helio.souza
   * @param data
   */
  atualizaData(data: Pagination<PedidoHeader>) {
    this.data = data;
    this.infiniteScroll.disabled = this.data.last;
  }

  openSlide(itemSlide: IonItemSliding): void {
    itemSlide.open('end');
  }

  closeSlide(itemSlide: IonItemSliding): void {
    itemSlide.close();
  }

  verProdutosPedido(pedido: PedidoHeader) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pedido: JSON.stringify(pedido),
      },
      skipLocationChange: true,
    };
    this.navControl.navigateForward(['/pedido-resumo'], navigationExtras);
  }

  /**
   * @author helio.souza
   * @param pedido
   */
  apagarPedido(pedido: PedidoHeader): void {
    const props = {
      titulo: 'ATENÇÃO!',
      message: `Tem certeza? Apagando um pedido, os dados inseridos não poderão ser recuperados.`,
      handler: () => {
        this.pedidoService.apagarPedido(pedido.numpedido);
      },
    };
    this.common.showAlertAction(props);
  }

  alterarPedido(pedido: any) {
    this.pedidoManutencaoService.reabrirPedido(pedido);
  }
}
