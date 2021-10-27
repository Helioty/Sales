import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonSegment, IonSlides, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import {
  PedidoHeader,
  PedidoItem,
  Retiradas,
} from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import {
  IProduto,
  IProdutoEstoqueDeposito,
} from 'src/app/services/produto/produto.interface';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { TMSService } from 'src/app/services/TMS/tms.service';

@Component({
  selector: 'app-produto-adicionar-sacola',
  templateUrl: './produto-adicionar-sacola.page.html',
  styleUrls: ['./produto-adicionar-sacola.page.scss'],
})
export class ProdutoAdicionarSacolaPage implements OnInit {
  @ViewChild(IonSegment, { static: true }) readonly segment: IonSegment;
  @ViewChild(IonSlides, { static: true }) readonly slides: IonSlides;
  // Lista de inputs dos depositos
  @ViewChildren('inputDeposito') inputs: QueryList<IonInput>;
  // Input do TMS
  @ViewChild('inputTMS', { static: true }) inputTMS: IonInput;
  public inputTMSvalue = 0;

  public pedidoOBS: Observable<PedidoHeader>;

  // Produto e depositos de retirada
  public produto: IProduto;
  public depCalled = false;
  public depositos: IProdutoEstoqueDeposito[] = [];
  public showDepositos = false;

  // Dados do TMS
  public dadosRetornoTMS: any[] = [];
  public vendedorSelecionado: any;
  public opcaoSelecionada: any;
  public loadingTMS = false;

  // Remake TMS
  public opcoesDeEntregaTMS: any[] = [];
  public selectedTmsOptionIndex: [number, number] = [null, null];
  private readonly indexSeller = 0;
  private readonly indexOption = 1;

  // Controle de adicionar a sacola
  private entregaTMSselecionada = false;

  // Controle dos itens do pedido
  private pedidoItem = new PedidoItem();

  // Retiradas
  private retiradas: Retiradas[] = [];

  // Controle de navegacao
  private navParams: { paginaAnterior: string; paginaSeguinte: string };

  // Controla a gravação da opção de TMS para poder prosseguir
  private statusGravacao = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly common: CommonService,
    private readonly navControl: NavController,
    private readonly pedidoService: PedidoService,
    private readonly produtoService: ProdutoService,
    private readonly tmsService: TMSService
  ) {}

  ngOnInit(): void {
    this.slides.lockSwipes(true);
    this.pedidoOBS = this.pedidoService.getPedidoAtivoOBS();
    this.route.queryParams.subscribe({
      next: (params) => {
        this.produto = JSON.parse(params.produto);
        this.navParams = {
          paginaAnterior: params?.paginaAnterior ?? '',
          paginaSeguinte: params?.paginaSeguinte ?? '',
        };
      },
    });
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
    this.pedidoItem = new PedidoItem();
    this.pedidoItem.idEmpresa = parseInt(localStorage.getItem('empresa'));
    this.pedidoItem.numPedido = this.pedidoService.getPedidoNumero();
    this.pedidoItem.idProduto = this.produto.codigodigitoembalagem;
    this.pedidoItem.embalagem = 0;
    this.pedidoItem.qtdTotal = 0;
    this.pedidoItem.prcUnitario = 0;
    this.pedidoItem.prcTotal = 0;
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    if (this.pedidoService.tipoRetiradaIndex === 2) {
      this.segment.value = '1';
    } else {
      this.getProdutoDepositos();
    }
  }

  ionViewWillLeave(): void {}

  ionViewDidLeave(): void {}

  /**
   * @author helio.souza
   * @param slide Index do slide destino.
   */
  slideTo(slide: number): void {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
    this.atualizaBySlide();
  }

  /**
   * @author helio.souza
   */
  getProdutoDepositos(): void {
    this.depCalled = true;
    this.produtoService
      .getDeposito(
        this.produto.codigodigitoembalagem,
        this.pedidoService.getPedidoNumero()
      )
      .subscribe({
        next: (result) => {
          this.depositos = result;
          this.showDepositos = true;
          console.log('Depositos: ', result);
        },
        error: () => {
          this.showDepositos = true;
        },
      });
  }

  atualizaBySlide(): void {
    this.slides.getActiveIndex().then((result) => {
      switch (result) {
        case 1:
          setTimeout(() => {
            this.inputTMS.setFocus();
          }, 200);
          break;

        default:
          break;
      }
    });
  }

  // edit by Helio 09/07/2020
  validateField(): boolean {
    if (this.entregaTMSselecionada && this.inputTMSvalue) {
      return true;
    } else {
      return this.validaQtdRetiradaLoja();
    }
  }

  validaQtdRetiradaLoja(): boolean {
    for (const el in this.depositos) {
      if (this.depositos[el].qtdPedido > 0) {
        return true;
      }
    }
  }

  zeroQtd(): void {
    this.common.showAlert('Atenção!', 'Informar quantidade retirada.');
  }

  /**
   * @author helio.souza
   * @description Adicionar produto ao pedido.
   */
  adicionarAoPedido(): void {
    if (this.segment.value === '0') {
      this.adicionarLocal(this.depositos);
    } else {
      this.adicionarComTMS(this.inputTMSvalue, this.produto);
    }

    // // Chama a gravação do TMS
    // if (this.entregaTMSselecionada && this.inputTMSvalue) {
    //   this.adicionarComTMS(this.inputTMSvalue, this.produto);
    // }
    // //  Chama a gracação da retirada em Loja
    // if (this.validaQtdRetiradaLoja()) {
    //   this.adicionarLocal(this.depositos);
    // } else {
    //   if (this.statusGravacao) {
    //     this.prosseguir();
    //   }
    // }
  }

  prosseguir(): void {
    if (this.navParams.paginaAnterior) {
      switch (this.navParams.paginaAnterior) {
        case 'pedido-sacola':
          this.navControl.pop();
          break;

        default:
          this.navControl.navigateRoot('pedido-sacola');
          break;
      }
    } else {
      this.navControl.navigateRoot('pedido-sacola');
    }
  }

  /**
   * @author helio.souza
   * @param depositos
   */
  async adicionarLocal(depositos: IProdutoEstoqueDeposito[]): Promise<void> {
    for (const el in depositos) {
      if (depositos[el].qtdPedido > depositos[el].estoque) {
        this.common.showToast('Estoque insuficiente');
        this.inputs.toArray()[el].setFocus();
        return;
      } else if (depositos[el].qtdPedido > 0) {
        const retirada = new Retiradas();
        retirada.empresaRetirada = parseInt(depositos[el].empresa);
        retirada.idDeposito = parseInt(depositos[el].deposito);
        retirada.tipoRetirada = parseInt(depositos[el].tipoEntrega);
        retirada.qtd = depositos[el].qtdPedido;
        retirada.precoUnitario = this.produto.prvd1;
        this.retiradas.push(retirada);
      }
    }
    this.pedidoItem.retiradas = this.retiradas;
    if (!this.pedidoItem?.retiradas.length) {
      this.common.showToast('Selecione a quantidade de retirada!');
    } else {
      await this.common.showLoaderCustom('Adicionando produto...');
      this.pedidoService.adicionarItemPedido(this.pedidoItem).subscribe({
        next: (response) => {
          console.log('Resultado: ', response);
          this.common.loading.dismiss();
          this.prosseguir();
        },
        error: () => this.common.loading.dismiss(),
      });
    }
  }

  /**
   * @author helio.souza
   * @param qtd
   * @param produto
   */
  async adicionarComTMS(qtd: number, produto: any): Promise<void> {
    if (
      this.selectedTmsOptionIndex[this.indexSeller] === null &&
      this.selectedTmsOptionIndex[this.indexOption] === null
    ) {
      this.common.showToast('Selecione uma opção de entrega!');
    } else {
      await this.common.showLoader();
      const numPedido = this.pedidoService.getPedidoNumero();
      this.tmsService
        .gravaOpcoesTMS(
          numPedido,
          String(qtd),
          this.produto.codigodigitoembalagem,
          produto.conversao
        )
        .subscribe({
          next: () => {
            this.common.loading.dismiss();
            this.prosseguir();
          },
          error: () => this.common.loading.dismiss(),
        });
    }
  }

  getOpcoes(qtd: number): void {
    this.selectedTmsOptionIndex = [null, null];
    let precolocal: 'S' | 'N' = 'N';
    this.validaQtdRetiradaLoja() ? (precolocal = 'S') : (precolocal = 'N');
    const endereco = this.pedidoService.getEnderecoEntrega();

    if (endereco && qtd) {
      this.loadingTMS = true;
      this.tmsService
        .getOpcoesTMS(
          endereco,
          String(qtd),
          this.produto.codigodigitoembalagem,
          precolocal
        )
        .subscribe({
          next: (response: any[]) => {
            this.dadosRetornoTMS = response;
            this.loadingTMS = false;
            console.log('opcoes entrega');
            console.log(response);

            // by Helio 09/01/2020
            // Seleciona automaticamente caso exista apenas uma opção de entrega
            if (response.length === 1) {
              this.vendedorSelecionado = this.dadosRetornoTMS[0];
              this.selectedTmsOptionIndex[this.indexSeller] = 0;
              if (this.vendedorSelecionado.opcoes.length === 1) {
                this.selectedTmsOptionIndex[this.indexOption] = 0;
                this.opcaoSelecionada = this.vendedorSelecionado.opcoes[0];
                this.entregaTMSselecionada = true;
              }
            }
          },
          error: () => {
            this.loadingTMS = false;
          },
        });
    } else {
    }
  }
}
