import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { IonInput, NavController, IonSearchbar } from '@ionic/angular';
import { Observable } from 'rxjs';
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
  @ViewChild('ip1', { static: true }) input1: IonInput;
  @ViewChild('ip2', { static: true }) input2: IonInput;
  @ViewChild('ip3', { static: true }) input3: IonInput;
  @ViewChild('ip4', { static: true }) input4: IonInput;
  @ViewChild('ip5', { static: true }) input5: IonInput;

  @ViewChild(IonSearchbar, { static: true }) readonly searchbar: IonSearchbar;

  public pedidoOBS: Observable<PedidoHeader>;
  public totalItensOBS: Observable<number>;

  // controle de exibição
  public pesquisaDetalhada = false;
  public pesquisando = false;
  public foco = false;
  public inputFoco = 0;

  // propriedades da pesquisa
  public soComEstoque = true;
  public p1 = 1;
  public p2 = 20;

  public pesquisaItems: IProduto[] = [];

  formPesquisa: FormGroup;

  constructor(
    public readonly scanner: ScannerService,
    private readonly common: CommonService,
    public readonly pedidoService: PedidoService,
    public readonly produtoService: ProdutoService,
    private readonly navControl: NavController,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log('Produto Pesquisa OnInit');
    this.setupFormPesquisa();
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
   */
  setupFormPesquisa(): void {
    this.formPesquisa = this.formBuilder.group({
      data: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * @author helio.souza
   */
  submitFormPesquisa(): void {
    console.log(this.formPesquisa);
    if (this.formPesquisa.valid) {
      console.log('Pesquisando...');
    }
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

  showPesquisa() {
    this.pesquisaDetalhada = !this.pesquisaDetalhada;
  }

  setInputComFoco(acao: string) {
    let input = '';
    if (acao === 'mais') {
      this.inputFoco++;
      input = this.inputFoco.toString();
    } else if (acao === 'menos') {
      this.inputFoco--;
      input = this.inputFoco.toString();
    }

    switch (input) {
      case '1':
        this.inputFoco = 1;
        this.input1.setFocus();
        break;

      case '2':
        this.inputFoco = 2;
        this.input2.setFocus();
        break;

      case '3':
        this.inputFoco = 3;
        this.input3.setFocus();
        break;

      case '4':
        this.inputFoco = 4;
        this.input4.setFocus();
        break;

      case '5':
        this.inputFoco = 5;
        this.input5.setFocus();
        break;

      default:
        this.inputFoco = 0;
        this.common.goToFullScreen();
        console.log('case-default');
        break;
    }
  }

  async pesquisar() {
    // const value = this.input1.value.toString();
    // let codigo: number;
    // if (value === '' || value === undefined) {
    //   codigo = null;
    // } else {
    //   codigo = parseInt(value);
    // }
    // this.pesquisando = true;
    // await this.pesquisa
    //   .getPesquisaDetalhada({
    //     codEmpresa: localStorage.getItem('empresa'),
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
    //     console.log(result);
    //     this.pesquisaItems = result.content;
    //     this.pesquisaDetalhada = false;
    //     this.pesquisando = false;
    //   })
    //   .catch((err) => {
    //     this.pesquisando = false;
    //     console.log(err);
    //   });
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
