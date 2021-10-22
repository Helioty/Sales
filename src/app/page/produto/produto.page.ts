import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { IProduto, IProdutoFamilia } from 'src/app/services/produto/produto.interface';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  public pedidoOBS: Observable<PedidoHeader>;
  public totalItensOBS: Observable<number>;

  // controla os dados do produto
  public produto: IProduto;
  public produtoFamilia: any[] = [];
  public familiaSelecionada: any;

  // controla a exibição do botão que leva a tela de mais informações
  public showMaisInfo = false;
  private maisInfo: any = [];

  constructor(
    private readonly common: CommonService,
    public readonly scanner: ScannerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly pedidoService: PedidoService,
    private readonly dataService: DataService,
    private readonly produtoService: ProdutoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.pedidoOBS = this.pedidoService.getPedidoAtivoOBS();
    this.totalItensOBS = this.pedidoService.getTotalItensOBS();
    this.activatedRoute.queryParams
      .pipe(
        tap({
          next: (params) => {
            this.produto = JSON.parse(params.produto) as IProduto;
          },
        }),
        switchMap(() => this.getFamilia(this.produto.codigodigitoembalagem)),
        switchMap(() => this.getProdutoInformacao(this.produto.codigodigitoembalagem)),
        switchMap(() => this.getImage(this.produto.codigodigito))
      )
      .subscribe();
  }

  ionViewWillEnter(): void {
    this.scanner.focusOn();
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.scanner.focusOff();
  }

  ionViewDidLeave(): void {}

  /**
   * @author helio.souza
   * @param value Valor escaneado.
   */
  scaneado(value: string): void {
    if (value.substring(0, 1) === 'P') {
      this.pedidoService
        .setCardPedido(this.pedidoService.getPedidoNumero(), value)
        .subscribe();
    } else {
      this.common.showToast('Cartão Pedido inválido!');
    }
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
   */
  openClientePage(): void {
    this.pedidoService.openCustomPage('cliente', 'back', 'produto');
  }

  /**
   * @author helio.souza
   * @param produtoCodigoDigitoEmbalagem Codigo do Produto com Digito e Embalagem.
   */
  getProdutoInformacao(produtoCodigoDigitoEmbalagem: string): Observable<any> {
    return this.produtoService.getProductInfomation(produtoCodigoDigitoEmbalagem).pipe(
      tap({
        next: (response) => {
          this.showMaisInfo = response.items.length > 0;
          this.maisInfo = response.items;
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @param produtoCodigoDigitoEmbalagem Codigo do Produto com Digito e Embalagem.
   */
  getFamilia(produtoCodigoDigitoEmbalagem: string): Observable<IProdutoFamilia[]> {
    return this.produtoService.getFamilia(produtoCodigoDigitoEmbalagem).pipe(
      tap({
        next: (response) => {
          console.log('Familia do produto', response);
        },
      })
    );
    // this.produtoService.getFamilia(codigo).then(
    //   (result: any) => {
    //     this.produtoFamilia = result;
    //     for (const i in result) {
    //       for (const x in result[i].items) {
    //         result[i].qtdItems = x + 1;

    //         if (
    //           result[i].items[x].selected === 1 &&
    //           result[i].items[x].id_produto === this.produto.codigodigitoembalagem
    //         ) {
    //           result[i].valor = result[i].items[x].valor_atributo;
    //           console.log('Valor da familia');
    //           console.log(result[i].valor);
    //           this.familiaSelecionada = result[i].items[x].valor_atributo;
    //         } else {
    //           result[i].valor = '';
    //         }
  }

  changeFamilia(valor: string, index: number) {
    this.produtoFamilia[index].items.forEach((element: any) => {
      if (element.valor_atributo === valor) {
        this.produtoService.getProduto(element.id_produto).then((result: any) => {
          console.log(result);
          this.produto = result.content[0];
          this.getImage(this.produto.codigodigito);
          this.getFamilia(this.produto.codigodigitoembalagem);
          this.getProdutoInformacao(this.produto.codigodigitoembalagem);
        });
      }
    });
  }

  /**
   * @author helio.souza
   * @param produto
   */
  openProdutoDetalhe(produto: IProduto): void {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true,
      queryParams: {
        produto: JSON.stringify(produto),
      },
    };
    this.dataService.setData('produtoInformacao', this.maisInfo);
    this.navControl.navigateForward(['produto/detalhes'], navigationExtras);
  }

  /**
   * @author helio.souza
   * @param produtoCodigoDigito
   */
  async openProdutoImagens(produtoCodigoDigito: string): Promise<void> {
    await this.common.showLoader();
    this.produtoService
      .getAllListImage(produtoCodigoDigito)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log('Imagens: ', response);
          this.dataService.setData('produtoListImage', response);
          this.navControl.navigateForward(['produto/imagens']);
          this.common.loading.dismiss();
        },
        error: () => {
          this.common.loading.dismiss();
        },
      });
  }

  /**
   * @author helio.souza
   * @param produtoCodigoDigito Codigo e Digito do Produto.
   */
  getImage(produtoCodigoDigito: string) {
    return this.produtoService.getFirstImage(produtoCodigoDigito).pipe(
      tap({
        next: (result) => {
          this.produto.imagem = result.imageGrande;
        },
      })
    );
  }

  goToAddSacola(prod: IProduto): void {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true,
      queryParams: {
        produto: JSON.stringify(this.produto),
        paginaSeguinte: 'pedido-sacola',
        paginaAnterior: 'produto',
      },
    };
    // this.dataService.setData('produto-adicionar-sacola', prod);
    this.navControl.navigateForward(['/produto-adicionar-sacola'], navigationExtras);
  }
}
