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

  // controla a exibição do botão que leva a tela de mais informações
  public showMaisInfo = false;
  private maisInfo = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public common: CommonService,
    public pedidoService: PedidoService,
    private dataService: DataService,
    private produtoService: ProdutoService,
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

  ionViewDidLeave() {

  }

  // Cria o loop que da foco no input
  focusOn() {
    if (this.platform.is('cordova')) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = '';
          if (this.focusStatus) {
            document.getElementById('scanner').focus();
          }
        } catch (error) { }
      }, 300);
    }
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
  }

  // Encerra o loop de foco no input
  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 150);
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
    await this.produtoService.getProductInfomation(codigo).then((result: any) => {
      console.log(result);
      this.showMaisInfo = (result.items.length > 0);
      this.maisInfo = result.items;
    }, (error) => {
      console.log(error);
    });
  }

  // pega as informações do produto
  async getFamilia(codigo: string) {
    await this.produtoService.getFamilia(codigo).then((result: any) => {
      console.log('familia');
      console.log(result);
      this.produtoFamilia = result;
    }, (error) => {
      console.log(error);
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
    await this.produtoService.getAllListImage(codigoNoEmbalagem).then((result: any) => {
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
    console.log(codigoDigitoEmb)
    await this.produtoService.getFirstImage(codigoDigitoEmb).then((result: any) => {
      this.produto.imagem = result[0].imageGrande;
    });
  }

  goToAddSacola(produto: Produto) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'pedido-sacola',
        paginaAnterior: 'produto',
        produto: JSON.stringify(produto)
      }
    };
    this.navControl.navigateForward(['/produto-adicionar-sacola'], navigationExtras);
  }

}
