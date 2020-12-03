import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { Produto } from 'src/app/class/produto';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;

  // controla os dados do produto
  public produto = new Produto();
  public produtoFamilia: any[] = [];
  public familiaSelecionada: any;

  // controla a exibição do botão que leva a tela de mais informações
  public showMaisInfo = false;
  private maisInfo = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public common: CommonService,
    public pedidoService: PedidoService,
    private dataService: DataService,
    private produtoS: ProdutoService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.produto = JSON.parse(params.produto);
    });
  }

  ionViewWillEnter() {
    this.focusOn();
    this.common.goToFullScreen();
    this.getImage(this.produto.codigo);
    this.getFamilia(this.produto.codigodigitoembalagem);
    this.getProdutoInformacao(this.produto.codigodigitoembalagem);
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.focusOff();
  }

  ionViewDidLeave() { }

  // Cria o loop que da foco no input
  focusOn() {
    this.taskScanner = setInterval(() => {
      try {
        this.valorScanner = '';
        if (this.focusStatus) {
          const scanners = document.body.getElementsByClassName('scanner');
          for (const i in scanners) {
            if (Number(i) === (scanners.length - 1)) {
              (scanners[i] as HTMLInputElement).focus();
            }
          }
        }
      } catch (error) { }
    }, 350);
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    const scanners = document.body.getElementsByClassName('scanner');
    for (const i in scanners) {
      if (Number(i) === (scanners.length - 1)) {
        (scanners[i] as HTMLInputElement).blur();
      }
    }
  }

  // Encerra o loop de foco no input
  focusOff() {
    clearInterval(this.taskScanner);
  }

  scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
          this.pedidoService.setCardPedido(codigo);
          this.focusPlay();
        } else {

        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }

  async adicionarCartaoPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Cartão Pedido',
      cssClass: 'ion-alert-input',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Digite o codigo do cartão!'
        }
      ],
      buttons: ['CANCELAR', {
        text: 'ADICIONAR',
        handler: (data: any) => {
          this.pedidoService.setCardPedido(data.codigo);
        }
      }]
    });
    alert.onDidDismiss().finally(() => { this.focusPlay(); });
    await alert.present().then(() => {
      this.focusPause();
    });
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto'
      }
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  // pega as informações do produto
  async getProdutoInformacao(codigo: string) {
    await this.produtoS.getProductInfomation(codigo).then((result: any) => {
      console.log(result);
      this.showMaisInfo = (result.items.length > 0);
      this.maisInfo = result.items;
    }, (error) => {
      console.log(error);
    });
  }

  // pega as informações do produto
  async getFamilia(codigo: string) {
    await this.produtoS.getFamilia(codigo).then((result: any) => {
      console.log('Familia do produto');
      console.log(result);
      this.produtoFamilia = result;
      for (const i in result) {
        for (const x in result[i].items) {
          result[i].qtdItems = x + 1;

          if (result[i].items[x].selected === 1 && result[i].items[x].id_produto === this.produto.codigodigitoembalagem) {
            result[i].valor = result[i].items[x].valor_atributo;
            console.log('Valor da familia');
            console.log(result[i].valor);
            this.familiaSelecionada = result[i].items[x].valor_atributo;
          } else {
            result[i].valor = '';
          }
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  changeFamilia(valor: string, index: number) {
    this.produtoFamilia[index].items.forEach((element: any) => {
      if (element.valor_atributo === valor) {
        this.produtoS.getProduto(element.id_produto).then((result: any) => {
          console.log(result);
          this.produto = result.content[0];
          this.getImage(this.produto.codigo);
          this.getFamilia(this.produto.codigodigitoembalagem);
          this.getProdutoInformacao(this.produto.codigodigitoembalagem);
        });
      }
    });
  }

  openProdutoDetalhe(produto: Produto) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        produto: JSON.stringify(produto),
        info: 'produtoInformacao'
      }
    };
    this.dataService.setData('produtoInformacao', this.maisInfo);
    this.navControl.navigateForward(['/produto-detalhes'], navigationExtras);
  }

  async openProdutoImagens(codigoNoEmbalagem: string) {
    await this.common.showLoader();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        dataId: 'produtoListImage'
      }
    };
    await this.produtoS.getAllListImage(codigoNoEmbalagem).then((result: any) => {
      // console.log(result);
      this.dataService.setData('produtoListImage', result);
      this.navControl.navigateForward(['/produto-imagens'], navigationExtras);
      this.common.loading.dismiss();
    }, (error) => {
      this.common.loading.dismiss();
      console.log(error);
    });
  }

  async getImage(codigoDigitoEmb: string) {
    console.log(codigoDigitoEmb);
    await this.produtoS.getFirstImage(codigoDigitoEmb).then((result: any) => {
      this.produto.imagem = result[0].imageGrande;
    });
  }

  goToAddSacola(prod: Produto) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'pedido-sacola',
        paginaAnterior: 'produto'
      }
    };
    this.dataService.setData('produto-adicionar-sacola', prod);
    this.navControl.navigateForward(['/produto-adicionar-sacola'], navigationExtras);
  }

}
