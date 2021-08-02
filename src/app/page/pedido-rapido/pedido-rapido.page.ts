import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import {
  PedidoHeader,
  PedidoItem,
  Retiradas,
} from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pedido-rapido',
  templateUrl: './pedido-rapido.page.html',
  styleUrls: ['./pedido-rapido.page.scss'],
})
export class PedidoRapidoPage implements OnInit {
  public pedidoOBS: Observable<PedidoHeader>;
  public itensOBS: Observable<PedidoItem[]>;

  // controle de retiradas de produtos.
  private novoPedidoItem: PedidoItem;
  private retiradas: Retiradas;

  // controle de requisições by Ryuge 28/11/2019
  private readonly maxRequest = 10;
  private codProdRequest = '';
  private numRequest = 0;

  constructor(
    public readonly scanner: ScannerService,
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.pedidoOBS = this.pedidoService.getPedidoAtivo();
    this.itensOBS = this.pedidoService.getPedidoItensOBS();
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
      this.addItem(value);
    }
  }

  /**
   * @author helio.souza
   * @description Atualiza os Produtos do Pedido.
   */
  atualizaItens(): void {
    this.pedidoService
      .getPedidoAllItens(this.pedidoService.getPedidoNumero())
      .subscribe();
  }

  /**
   * @author helio.souza
   * @param produtoCodigo Codigo do produto scaneado.
   */
  addItem(produtoCodigo: string): void {
    const empresa = localStorage.getItem('empresa') as string;

    this.novoPedidoItem = new PedidoItem();
    this.novoPedidoItem.idEmpresa = Number(empresa);
    this.novoPedidoItem.numPedido = this.pedidoService.getPedidoNumero();
    this.novoPedidoItem.idProduto = produtoCodigo;
    this.novoPedidoItem.embalagem = 0;
    this.novoPedidoItem.qtdTotal = 0;
    this.novoPedidoItem.prcUnitario = 0;
    this.novoPedidoItem.prcTotal = 0;

    this.adicionarSacola(produtoCodigo);
  }

  /**
   * @author helio.souza
   * @param produtoCodigo Codigo do produto scaneado.
   */
  adicionarSacola(produtoCodigo: string): void {
    const tipo = this.pedidoService.tipoRetiradaIndex;
    const aRetiradas: Retiradas[] = [];
    try {
      this.retiradas = new Retiradas();
      this.retiradas.empresaRetirada = parseInt(localStorage.getItem('empresa'));
      this.retiradas.idDeposito = 8;
      this.retiradas.tipoRetirada = tipo;
      this.retiradas.qtd = 1;
      this.retiradas.precoUnitario = 0;

      aRetiradas.push(this.retiradas);
      this.novoPedidoItem.retiradas = aRetiradas;
      console.log('Novo Pedido Item', this.novoPedidoItem);
    } catch (error) {}

    // by Ryuge 27/11/2019 - Controle de requisições para o mesmo produto escaneado
    if (this.codProdRequest === produtoCodigo) {
      this.sameProduto(this.novoPedidoItem);
    } else {
      this.newProduto(this.novoPedidoItem);
    }
  }

  /**
   * @author helio.souza
   * @param pedidoItem
   */
  newProduto(pedidoItem: PedidoItem): void {
    this.numRequest = 0;
    this.codProdRequest = pedidoItem.idProduto;
    if (pedidoItem.retiradas.length && pedidoItem.idProduto) {
      this.addItemPedido(this.novoPedidoItem);
    }
  }

  /**
   * @author helio.souza
   * @param pedidoItem
   */
  sameProduto(pedidoItem: PedidoItem): void {
    this.numRequest += 1;
    if (this.numRequest <= this.maxRequest) {
      if (pedidoItem.retiradas.length && pedidoItem.idProduto) {
        this.addItemPedido(this.novoPedidoItem);
      }
    } else {
      this.common.showToast('Favor aguarde processamento...');
      // by Helio - libera as requisições apos certo periodo
      setTimeout(() => {
        this.numRequest = 0;
      }, 1500);
    }
  }

  /**
   * @author helio.souza
   * @param body
   */
  addItemPedido(body: PedidoItem): void {
    console.log('AddItemPedido Rapido!');
    this.pedidoService.adicionarItemPedidoRapido(body).subscribe({
      next: (item) => {
        console.log('Itens: ', item);
        this.decreaseRequestNum();
      },
      error: () => {
        this.decreaseRequestNum();
      },
    });
  }

  /**
   * @author helio.souza
   */
  decreaseRequestNum(): void {
    if (this.numRequest) {
      this.numRequest -= 1;
    }
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
}
