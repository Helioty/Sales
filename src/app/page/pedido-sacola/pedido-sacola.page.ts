import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import { PedidoHeader, PedidoItem } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pedido-sacola',
  templateUrl: './pedido-sacola.page.html',
  styleUrls: ['./pedido-sacola.page.scss'],
})
export class PedidoSacolaPage implements OnInit {
  public pedidoOBS: Observable<PedidoHeader>;
  public itensOBS: Observable<PedidoItem[]>;
  public totalItensOBS: Observable<number>;

  public showInfo = false;

  // by Helio 11/12/2019
  public existeProdEntrega = false;
  public existeProdRetirada = false;
  public existeProdRetiradaDepo = false;

  constructor(
    public readonly scanner: ScannerService,
    private readonly dataService: DataService,
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly produtoService: ProdutoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.pedidoOBS = this.pedidoService.getPedidoAtivo();
    this.itensOBS = this.pedidoService.getPedidoItensOBS();
    this.totalItensOBS = this.pedidoService.getTotalItensOBS();
  }

  ionViewWillEnter(): void {
    this.scanner.focusOn();
    this.common.goToFullScreen();
    this.atualizaItens();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.scanner.focusOff();
  }

  ionViewDidLeave(): void {
    console.clear();
  }

  /**
   * @author helio.souza
   * @param value Dado scaneado.
   */
  scaneado(value: string): void {
    if (value.substring(0, 1) === 'P') {
      this.pedidoService
        .setCardPedido(this.pedidoService.getPedidoNumero(), value)
        .subscribe();
    } else {
      // this.addItem(value);
    }
  }

  /**
   * @author helio.souza
   * @description Atualiza os Produtos do Pedido.
   */
  atualizaItens(): void {
    this.pedidoService.getPedidoAllItens(this.pedidoService.getPedidoNumero()).subscribe({
      next: (produtos) => this.atualizaRetiradas(produtos),
    });
  }

  /**
   * @author helio.souza
   * @param produtos Itens do Pedido.
   */
  private atualizaRetiradas(produtos: PedidoItem[]): void {
    produtos.forEach((el) => {
      if (el.retiradas[0].tipoRetirada === 9997) {
        this.existeProdEntrega = true;
      } else if (el.retiradas[0].tipoRetirada !== 9997) {
        this.existeProdRetirada = true;
      }
    });
  }

  /**
   * @author helio.souza
   */
  sairDoPedido(): void {
    this.pedidoService.sairPedido();
  }

  /**
   * @author helio.souza
   * @description Atualiza o cartão pedido.
   */
  adicionarCartaoPedido(): void {
    this.pedidoService.adicionarCartaoPedido();
  }

  /**
   * @author helio.souza
   * @param produto Pedido Item da lista.
   */
  removerProduto(produto: PedidoItem): void {
    const handler = () => {
      this.pedidoService.removeItemPedido(produto.idProduto).subscribe();
    };
    const props = {
      titulo: 'Remover produto!',
      message: `Tem certeza que deseja remover o produto ${produto.descricao} do pedido?`,
      handler,
    };
    this.common.showAlertAction(props);
  }

  openClientePage(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-sacola',
      },
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  openProdutoAddSacolaPage(prod: any): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-sacola',
      },
    };
    this.dataService.setData('produto-adicionar-sacola', prod);
    this.navControl.navigateForward(['/produto-adicionar-sacola'], navigationExtras);
  }

  getProduto(codigo: string) {
    this.produtoService.getProduto(codigo).then((result: any) => {
      this.openProdutoAddSacolaPage(result.content[0]);
    });
  }

  // finalização do pedido
  finalizarPedido() {
    this.pedidoService.goToFinalizacao('pedido-sacola');
  }
}
