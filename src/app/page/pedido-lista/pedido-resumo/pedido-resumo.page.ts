import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader, PedidoItem } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { Pagination } from '../pedido-lista.interface';

@Component({
  selector: 'app-pedido-resumo',
  templateUrl: './pedido-resumo.page.html',
  styleUrls: ['./pedido-resumo.page.scss'],
})
export class PedidoResumoPage implements OnInit {
  @ViewChild(IonInfiniteScroll) readonly infiniteScroll: IonInfiniteScroll;
  readonly pedido = new BehaviorSubject<PedidoHeader>(null);
  readonly produtos = new BehaviorSubject<Pagination<PedidoItem>>(null);
  private paginaAtual = 1;

  public docTipo = '';
  public endereco: any;

  constructor(
    private readonly common: CommonService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    console.log('Pedido Resumo OnInit');
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.pedido.next(JSON.parse(params.pedido) as PedidoHeader);
    });
    this.separaDadosPedido();
    console.log(this.pedido);
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  separaDadosPedido(): void {
    if (!this.pedido.value.cartaoPedido) {
      this.pedido.value.barCodecartaoPedido = 'Sem Cartão';
    }
    if (!this.pedido.value.cgccpf_cliente) {
      this.docTipo = 'Cliente não selecionado.';
      this.pedido.value.cgccpf_cliente = '';
    } else {
      this.docTipo =
        this.pedido.value.cgccpf_cliente.length > 12
          ? 'CNPJ do cliente:'
          : 'CPF do cliente:';
    }
    const eve = (data: Pagination<PedidoItem> | null) => {
      this.produtos.next(data as Pagination<PedidoItem>);
      this.infiniteScroll.disabled = this.produtos.value.last;
    };
    this.getItens(this.paginaAtual, eve);
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinite: IonInfiniteScroll): void {
    const event = (data: Pagination<PedidoItem> | null) => {
      if (data) {
        this.paginaAtual = this.paginaAtual + 1;
        data.content = this.produtos.value.content.concat(data.content);
        this.produtos.next(data);
        infinite.complete();
        this.infiniteScroll.disabled = this.produtos.value.last;
      } else {
        infinite.complete();
      }
    };
    this.getItens(this.paginaAtual + 1, event);
  }

  /**
   * @author helio.souza
   * @param numPedido Número do Pedido.
   * @param event Ação a ser executada.
   */
  getItens(page: number, event = (data: Pagination<PedidoItem> | null) => {}): void {
    this.pedidoService.getPedidoItens(this.pedido.value.numpedido, page).subscribe({
      next: (it) => {
        event(it);
      },
      error: () => {
        event(null);
      },
    });
  }

  // Modificado por Nicollas Bastos em 10-09-2018
  // Modificado por Helio em 21/01/2020
  // Metodo carrega todas as informações necessárias da lista de produtos e endereço de entrega
  async getItensMaisEndereco(nuPedido: any) {
    try {
      // if (this.pedido.frete.valor > 0) {
      //   let enderecos: any;
      //   const linkEndereco =
      //     ENV.WS_VENDAS +
      //     API_URL +
      //     'PedidoVenda/' +
      //     localStorage.getItem('empresa') +
      //     '/' +
      //     nuPedido +
      //     '/listEnderecos';
      //   await this.baseService.get(linkEndereco).then((result: any) => {
      //     console.log(result);
      //     enderecos = result;
      //   });
      //   if (enderecos.length > 0) {
      //     for (const end of enderecos) {
      //       if (end.seq_endereco === this.pedido.seqEnderecoEntrega) {
      //         this.endereco = end.dsc_endereco;
      //       }
      //     }
      //   }
      // }
      // if (this.show.length != this.produtos.totalElements) {
      //   this.show = new Array<boolean>(this.produtos.totalElements);
      // }
    } catch (error) {
      // this.exibeProdutosPedido = false;
      // this.exibeProdutos = true;
      // this.commonServices.showToast(error.json().detail);
    }
  }
}
