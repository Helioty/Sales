import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { IonInput, IonSearchbar, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { IProduto } from 'src/app/services/produto/produto.interface';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit {
  @ViewChild(IonInfiniteScroll) readonly infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar, { static: true }) readonly searchbar: IonSearchbar;

  public pedidoOBS: Observable<PedidoHeader>;
  public totalItensOBS: Observable<number>;

  public pesquisaItems: Observable<IProduto[]>;
  public showLoadingSpinner = false;
  readonly fieldPesquisa = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  constructor(
    public readonly scanner: ScannerService,
    private readonly common: CommonService,
    public readonly pedidoService: PedidoService,
    private readonly produtoService: ProdutoService,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    console.log('Produto Pesquisa OnInit');
    this.setPesquisa();
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

  /**
   * @author helio.souza
   * @description Pesquisa reativa.
   */
  setPesquisa(): void {
    this.pesquisaItems = this.fieldPesquisa.valueChanges.pipe(
      map((value: string) => value.trim()),
      filter((value) => value.length > 1),
      debounceTime(300),
      distinctUntilChanged(),
      tap({
        next: (pesquisa) => {
          console.log(`Valor pesquisado: ${pesquisa}`);
        },
      }),
      switchMap((value) => this.produtoService.getProdutoByCodigo(value)),
      tap({
        next: (result) => {
          console.log('Resultado da pesquisa: ', result);
        },
      })
    );
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinit: IonInfiniteScroll) {}

  log(l: any) {
    console.log(l);
  }

  /**
   * @author helio.souza
   * @param delay
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

  scaneado(value: string): void {
    if (value && value.length >= 2) {
      const codigo: string = value;

      if (codigo.substring(0, 1) === 'P') {
        this.pedidoService
          .setCardPedido(this.pedidoService.getPedidoNumero(), codigo)
          .subscribe();
      } else {
        console.log('nothing');
      }
    }
  }

  /**
   * @author helio.souza
   * @description Atualiza o cartão pedido.
   */
  adicionarCartaoPedido(): void {
    this.pedidoService.adicionarCartaoPedido();
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto-pesquisa',
      },
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  // showPesquisa() {
  //   this.pesquisaDetalhada = !this.pesquisaDetalhada;
  // }

  // setInputComFoco(acao: string) {
  //   let input = '';
  //   if (acao === 'mais') {
  //     this.inputFoco++;
  //     input = this.inputFoco.toString();
  //   } else if (acao === 'menos') {
  //     this.inputFoco--;
  //     input = this.inputFoco.toString();
  //   }

  //   switch (input) {
  //     case '1':
  //       this.inputFoco = 1;
  //       this.input1.setFocus();
  //       break;

  //     case '2':
  //       this.inputFoco = 2;
  //       this.input2.setFocus();
  //       break;

  //     case '3':
  //       this.inputFoco = 3;
  //       this.input3.setFocus();
  //       break;

  //     case '4':
  //       this.inputFoco = 4;
  //       this.input4.setFocus();
  //       break;

  //     case '5':
  //       this.inputFoco = 5;
  //       this.input5.setFocus();
  //       break;

  //     default:
  //       this.inputFoco = 0;
  //       this.common.goToFullScreen();
  //       console.log('case-default');
  //       break;
  //   }
  // }

  pesquisar(value: string): Observable<IProduto[]> {
    //   .getPesquisaDetalhada({
    //     codigo,
    //     descricao: this.input2.value.toString(),
    //     fornecedor: this.input3.value.toString(),
    //     modelo: this.input4.value.toString(),
    //     linha: this.input5.value.toString(),
    //     p1: parseInt(this.p1.toString()),
    //     p2: parseInt(this.p2.toString()),
    //     soComEstoque: this.soComEstoque,
    //   })
    //   .then((result: any) => {
    //     this.pesquisaItems = result.content;
    //     this.pesquisaDetalhada = false;
    //   })
    return this.produtoService.getProdutoByCodigo(value);
  }

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
