import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import {
  PedidoHeader,
  PedidoItens,
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
  public itensOBS: Observable<PedidoItens[]>;
  // public itens: any[] = [];

  private novoPedidoItem: PedidoItens;

  public pedidoItens: PedidoItens;
  public retiradas: Retiradas;

  // controle de requisições by Ryuge 28/11/2019
  private maxRequest = 10;
  private numRequest = 0;
  private codProdRequest = '';

  constructor(
    public readonly scanner: ScannerService,
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly navControl: NavController,
    private readonly platform: Platform
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
        .setCardPedido(this.pedidoService.pedido.value.numpedido, value)
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
      .getPedidoAllItens(this.pedidoService.pedido.value.numpedido)
      .subscribe();
  }

  // by Ryuge
  // edit by Helio 10/03/2020
  addItem(produtoCodigo: string): void {
    // by Ryuge 27/11/2019 - Não permitir gravar item com pedido = '0';
    const tipo = 'this.pedido.codigoTipoRetirada';
    const valor = 0;

    const empresa = localStorage.getItem('empresa') as string;
    this.novoPedidoItem = new PedidoItens();
    this.novoPedidoItem.idEmpresa = Number(empresa);
    this.novoPedidoItem.numPedido = this.pedidoService.pedido.value.numpedido;
    this.novoPedidoItem.idProduto = produtoCodigo;
    this.novoPedidoItem.embalagem = 0;
    this.novoPedidoItem.qtdTotal = 0;
    this.novoPedidoItem.prcUnitario = 0;
    this.novoPedidoItem.prcTotal = 0;

    this.adicionarSacola(tipo, valor, produtoCodigo);
  }

  adicionarSacola(tipo: string, valor: any, codigo: string) {
    const aRetiradas: any[] = [];
    try {
      this.retiradas = new Retiradas();
      // eslint-disable-next-line radix
      this.retiradas.empresaRetirada = parseInt(localStorage.getItem('empresa'));
      this.retiradas.idDeposito = 8;
      // eslint-disable-next-line radix
      this.retiradas.tipoRetirada = parseInt(tipo);
      this.retiradas.qtd = 1;
      this.retiradas.precoUnitario = parseFloat(valor);
      // add array
      aRetiradas.push(this.retiradas);

      console.log('this.retiradas');
      console.log(this.pedidoItens);

      // this.pedido.sistuacaoPedido = 'A';  // altera situação do pedido
      this.pedidoItens.retiradas = aRetiradas;

      // by Ryuge 27/11/2019
      // controle de requisições para o mesmo produto escaneado
      if (this.codProdRequest === codigo) {
        this.numRequest += 1;
        if (this.numRequest <= this.maxRequest) {
          if (
            this.pedidoItens.retiradas !== [] &&
            (this.pedidoItens.idProduto !== null || this.pedidoItens.idProduto !== '')
          ) {
            this.addItemPedido(this.pedidoItens);
          }
        } else {
          this.common.showToast('Favor aguarde processamento...');
          // by Helio - libera as requisições apos certo periodo
          if (this.numRequest === this.maxRequest) {
            setTimeout(() => {
              this.numRequest = 0;
            }, 2000);
          }
        }
      } else {
        this.numRequest = 0;
        this.codProdRequest = codigo;
        if (
          this.pedidoItens.retiradas !== [] &&
          (this.pedidoItens.idProduto !== null || this.pedidoItens.idProduto !== '')
        ) {
          this.addItemPedido(this.pedidoItens);
        }
      }
    } catch (error) {
      // this.common.showAlertInfo('Erro no adicionar sacola');
      // by Ryuge 28/11/2019
      if (error.status === 400) {
        // await this.showMessage(error.json().title, error.json().detail);
      } else if (error.status === 503) {
        this.common.showAlert('Atenção!', 'Sem serviço, entrar em contato com suporte.');
      } else {
        if (error.error.detail) {
          this.common.showAlert(error.error.title, error.error.detail);
        } else {
          this.common.showAlert('Atenção!', JSON.stringify(error));
        }
      }
    }
  }

  // by Ryuge
  // edit by Helio 10/03/2020
  async addItemPedido(body: PedidoItens) {
    // await this.pedidoIt.addFast(body).then(
    //   (result: any) => {
    //     this.itens = result.content;
    //     if (this.numRequest > 1) {
    //       this.numRequest -= 1;
    //     }
    //     console.log(result);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    // this.commonServices.ItensPedidoAdd = result.pedido; // cabeçalho dp pedido
    // this.totalPedido = result.pedido.totpedido;
  }

  // by Hélio 11/03/2020
  removerProduto(produto: PedidoItens): void {
    const handler = () => {
      this.deleteItemPedido(produto.idProduto);
    };
    const props = {
      titulo: 'Remover produto!',
      message: `Tem certeza que deseja remover o produto ${produto.descricao} do pedido?`,
      handler,
    };
    this.common.showAlertAction(props);
  }

  async deleteItemPedido(codigoProduto: string) {
    // await this.pedidoIt.removeItemPedido(codigoProduto).then((result: any) => {
    //   this.common.showToast(result.msg);
    // });
    // await this.pedidoIt.getItemPedido().then((result: any) => {
    //   this.itens = result.content;
    //   console.log(result);
    // });
  }
}
