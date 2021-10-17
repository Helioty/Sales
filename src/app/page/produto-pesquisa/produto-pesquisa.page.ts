import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { IonInfiniteScroll, IonSearchbar, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  onErrorResumeNext,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { IProduto } from 'src/app/services/produto/produto.interface';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';
import { Pagination } from './../pedido-lista/pedido-lista.interface';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) readonly infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar, { static: true }) readonly searchbar: IonSearchbar;

  // Dados do Pedido.
  public pedidoOBS: Observable<PedidoHeader>;
  public totalItensOBS: Observable<number>;

  // Controle de Loading.
  public showLoadingSpinner = false;

  // Dados da Pesquisa reativa.
  private fieldSub: Subscription;
  readonly fieldPesquisa = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  // Dados da Pesquisa e Paginação
  public pagination: Pagination<IProduto>;
  private pesquisado = '';
  private page = 1;

  constructor(
    public readonly scanner: ScannerService,
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly produtoService: ProdutoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    console.log('Produto Pesquisa OnInit');
    this.setPesquisa();
    this.pedidoOBS = this.pedidoService.getPedidoAtivo();
    this.totalItensOBS = this.pedidoService.getTotalItensOBS();
  }

  ionViewWillEnter(): void {
    this.scanner.focusOn();
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    this.setSearchbarFocus();
  }

  ionViewWillLeave(): void {
    this.scanner.focusOff();
  }

  ionViewDidLeave(): void {}

  ngOnDestroy(): void {
    this.fieldSub.unsubscribe();
  }

  /**
   * @author helio.souza
   * @description Pesquisa reativa.
   */
  setPesquisa(): void {
    this.fieldSub = this.fieldPesquisa.valueChanges
      .pipe(
        map((value: string) => value.trim()),
        filter((value) => value.length > 1),
        debounceTime(300),
        distinctUntilChanged(),
        tap({ next: () => (this.showLoadingSpinner = true) }),
        switchMap((value) => this.pesquisar(value)),
        map((response) => response.content)
      )
      .subscribe();
  }

  /**
   * @author helio.souza
   * @param value Dado a ser pesquisado.
   * @returns {Observable<Pagination<IProduto>>}
   */
  pesquisar(value: string): Observable<Pagination<IProduto>> {
    return this.produtoService
      .getProdutoPagination(value, this.pesquisado === value ? this.page + 1 : 1)
      .pipe(
        tap({
          next: () => (this.showLoadingSpinner = false),
          error: () => (this.showLoadingSpinner = false),
        }),
        onErrorResumeNext(),
        map((response) => this.mapPagination(response, value)),
        tap({
          next: (result) => {
            this.pesquisado = value;
            this.pagination = result;
          },
        })
      );
  }

  /**
   * @author helio.souza
   * @param pagination Dados da paginação da pesquisa.
   * @param pesquisado Dado pesquisado.
   * @returns {Pagination<IProduto>}
   */
  mapPagination(
    pagination: Pagination<IProduto>,
    pesquisado: string
  ): Pagination<IProduto> {
    if (this.pagination && this.pesquisado === pesquisado) {
      pagination.content = [...this.pagination.content, ...pagination.content];
      this.page += 1;
    } else {
      this.infiniteScroll.disabled = false;
      this.page = 1;
    }
    return pagination;
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinit: IonInfiniteScroll): void {
    this.pesquisar(this.pesquisado)
      .pipe(
        take(1),
        tap({
          next: (response) => {
            infinit.complete();
            infinit.disabled = response.last;
          },
          error: () => {
            infinit.complete();
          },
        })
      )
      .subscribe();
  }

  /**
   * @author helio.souza
   * @param delay Delay para executar o foco no searchbar.
   */
  setSearchbarFocus(delay = 500): void {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, delay);
  }

  /**
   * @author helio.souza
   */
  blurSearchBar(): void {
    try {
      this.searchbar.getInputElement().then((search) => search.blur());
    } catch (error) {}
  }

  /**
   * @author helio.souza
   * @param value Dado scaneado.
   */
  scaneado(value: string): void {
    if (value.length > 2 && value.substring(0, 1) === 'P') {
      this.pedidoService
        .setCardPedido(this.pedidoService.getPedidoNumero(), value)
        .subscribe();
    } else if (value.length > 2) {
      console.log('nothing');
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
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto-pesquisa',
      },
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  /**
   * @author helio.souza
   * @param produto Objeto do Produto.
   */
  goToProdutoPage(produto: IProduto) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'pedido-sacola',
        paginaAnterior: 'produto-pesquisa',
        produto: JSON.stringify(produto),
      },
    };
    this.navControl.navigateForward(['/produto'], navigationExtras);
  }
}
