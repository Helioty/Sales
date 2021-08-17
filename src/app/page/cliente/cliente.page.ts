import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PesquisaClienteComponent } from 'src/app/components/pesquisa-cliente/pesquisa-cliente.component';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit, OnDestroy {
  @ViewChild(IonInput, { static: false }) readonly search: IonInput;

  // Valor digitado no input de CPF/CNPJ
  public valorDigitado = '';

  // Controle da animação do skeleton
  public skeletonAni = false;

  // Controle da cor do background
  public colorState: 'isBlue' | 'isGreen' | 'isOrange' = 'isBlue';

  // Controle da pesquisa de CPF/CNPJ
  public isCNPJ = false;
  public atualizaCadastro = false;
  public novoCadastro = false;
  public mensagem = '';
  public isActive = '';

  // Dados do cliente.
  private clienteSub: Subscription;
  public dados: ClienteGet;
  public dadosShow = { nome: '', endereco: '', celular: '', email: '' };

  // Dados do Pedido.
  private pedidoSub: Subscription;
  private pedido: PedidoHeader;

  // Dados da navegação.
  private navParams: Params;

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly clienteService: ClienteService,
    private readonly modalCtrl: ModalController,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    console.log('Cliente OnInit');
    this.getPedidoAtivo();
    this.getClienteAtivo();
    this.getNavParams();
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    if (!this.pedido.cgccpf_cliente) {
      this.setEstado('reset');
    }
  }

  ionViewWillLeave(): void {}

  ionViewDidLeave(): void {}

  ngOnDestroy(): void {
    this.pedidoSub.unsubscribe();
    this.clienteSub.unsubscribe();
  }

  /**
   * @author helio.souza
   * @param delay
   */
  setInputFoco(delay = 500): void {
    setTimeout(() => {
      this.search.setFocus();
    }, delay);
  }

  /**
   * @author helio.souza
   */
  blurSearch(): void {
    try {
      this.search.getInputElement().then((search) => search.blur());
    } catch (error) {}
  }

  /**
   * @author helio.souza
   */
  private getPedidoAtivo(): void {
    this.pedidoSub = this.pedidoService.getPedidoAtivo().subscribe({
      next: (pedido) => (this.pedido = pedido),
    });
  }

  /**
   * @author helio.souza
   */
  private getNavParams(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params) => (this.navParams = params),
    });
  }

  /**
   * @author helio.souza
   */
  private getClienteAtivo(): void {
    this.clienteSub = this.pedidoService.getPedidoClienteOBS().subscribe({
      next: (clie) => {
        this.dados = clie;
        if (clie) {
          this.valorDigitado = this.common.formataCPFNPJ(clie.cgccpf);
          this.atualizaExibicaoDadosCliente(clie);
        }
      },
    });
  }

  /**
   * @author helio.souza
   * @description Mascara dinamica para o input.
   */
  dynamicMask(): void {
    if (this.valorDigitado && this.valorDigitado.length > 2) {
      this.valorDigitado = this.common.formataCPFNPJ(this.valorDigitado);
    }
  }

  /**
   * @author helio.souza
   * @param estado Estado da pagina.
   */
  setEstado(estado: 'atualizacao' | 'confirmacao' | 'novo' | 'reset'): void {
    this.skeletonAni = false;
    switch (estado) {
      case 'atualizacao':
        this.atualizaCadastro = true;
        this.novoCadastro = false;
        this.colorState = 'isGreen';
        break;

      case 'confirmacao':
        this.atualizaCadastro = false;
        this.novoCadastro = false;
        this.colorState = 'isGreen';
        break;

      case 'novo':
        this.atualizaCadastro = false;
        this.novoCadastro = true;
        this.colorState = 'isOrange';
        break;

      case 'reset':
        this.resetOperation();
        this.setInputFoco();
        break;
    }
  }

  /**
   * @author helio.souza
   * @description Reseta o estado da pagina.
   */
  resetOperation(): void {
    this.dados = null;
    this.atualizaCadastro = false;
    this.novoCadastro = false;
    this.isCNPJ = false;
    this.isActive = '';
    this.dadosShow = { nome: '', endereco: '', celular: '', email: '' };
    this.colorState = 'isBlue';
  }

  /**
   * @description Checa o minimo de caracteres necessarios para executar a chamada.
   * @param doc CPF/CNPJ do cliente.
   */
  checaMinimo(doc: string) {
    const clieDoc: string = doc.replace(/\D/g, '');
    if (clieDoc.length > 10) {
      this.getCliente(clieDoc);
    }
  }

  /**
   * @author helio.souza
   * @param doc CPF/CNPJ do cliente.
   */
  getCliente(doc: string): void {
    this.skeletonAni = true;
    this.clienteService.getCliente(doc, false).subscribe({
      next: (response) => {
        this.dados = response;
        this.atualizaExibicaoDadosCliente(response);
        this.skeletonAni = false;
      },
      error: (err) => {
        this.skeletonAni = false;
        if (err.error && err.error.detail) {
          this.mensagem = 'Não encontramos o cadastro do cliente!';
          this.setEstado('novo');
        } else {
          this.setEstado('reset');
        }
      },
    });
  }

  /**
   * @author helio.souza
   * @param clie Dados do Cliente.
   */
  private atualizaExibicaoDadosCliente(clie: ClienteGet): void {
    this.isCNPJ = clie.natureza !== 'FISICA';
    this.isActive = clie.ativo;
    this.atualizaCadastro = clie.atualizaCadastro;
    if (this.atualizaCadastro) {
      this.setEstado('atualizacao');
    } else {
      this.setEstado('confirmacao');
    }
    this.showDados(clie);
  }

  /**
   * @author helio.souza
   * @param dados Dados do usuario.
   */
  private showDados(dados: ClienteGet): void {
    this.dadosShow.nome = dados.nome;
    try {
      this.dadosShow.endereco = dados.endereco;
      this.dadosShow.endereco = dados.numero
        ? this.dadosShow.endereco + ', ' + dados.numero
        : this.dadosShow.endereco;
      this.dadosShow.email = dados.emails[0] ? dados.emails[0]?.email_site : '';
      this.dadosShow.celular = this.common.formataFONE(
        dados.celulares[0].ddd + dados.celulares[0].numero
      );
    } catch (error) {}
  }

  /**
   * @author helio.souza
   * @description Remove o cliente do pedido/limpa a tela.
   */
  naoCliente(): void {
    if (this.pedido.cgccpf_cliente) {
      const action = () => this.setEstado('reset');
      this.pedidoService.confirmaRemoveCliente(action);
    } else {
      this.setEstado('reset');
    }
  }

  cadastrarNovo(): void {
    this.toCadastroEdicao(this.navParams, 'novo');
  }

  editarCadastro(): void {
    this.toCadastroEdicao(this.navParams, 'edicao');
  }

  /**
   * @author helio.souza
   * @description Controla a navegação para a tela de cadastro/edição.
   * @param navParams Parametros de navegação.
   * @param situacao Situação do cadastro.
   */
  private toCadastroEdicao(navParams: Params, situacao: 'edicao' | 'novo'): void {
    const doc = this.valorDigitado;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: '',
        paginaAnterior: 'back',
        situacao: situacao,
        dados: null,
      },
    };
    if (situacao === 'edicao') {
      navigationExtras.queryParams.dados = JSON.stringify(this.dados);
    }
    switch (navParams.paginaAnterior) {
      case 'pedido-retirada':
        navigationExtras.queryParams.paginaSeguinte = 'produto-atalhos';
        navigationExtras.queryParams.paginaAnterior = 'pedido-retirada';
        break;

      default:
        navigationExtras.queryParams.paginaSeguinte = navParams.paginaAnterior;
        break;
    }
    this.navControl.navigateForward([`cliente/${situacao}`, doc], navigationExtras);
  }

  /**
   * @author helio.souza
   * @description Grava o cliente no Pedido.
   */
  async confirmaCliente(): Promise<void> {
    const doc = this.valorDigitado.replace(/\D/g, '');
    await this.common.showLoader();
    if (this.pedido.cgccpf_cliente !== doc) {
      this.pedidoService
        .adicionarCliente(this.pedidoService.getPedidoNumero(), doc, this.dados)
        .subscribe({
          next: () => {
            this.common.loading.dismiss();
            this.prosseguir();
          },
          error: () => {
            this.common.loading.dismiss();
          },
        });
    } else {
      this.common.loading.dismiss();
      this.prosseguir();
    }
  }

  /**
   * @author helio.souza
   * @description Navegação seguinte da pagina.
   */
  private prosseguir(): void {
    const paginaSeguinte = this.navParams.paginaSeguinte;
    switch (paginaSeguinte) {
      case 'back':
        this.navControl.pop();
        break;

      case 'endereco-entrega':
        const navigationExtras: NavigationExtras = {
          queryParams: {
            paginaSeguinte: 'pedido-atalhos',
            paginaAnterior: 'cliente',
          },
        };
        this.navControl.navigateForward(['/' + paginaSeguinte], navigationExtras);
        break;

      case 'finalizaService':
        this.pedidoService.goToFinalizacao('cliente');
        break;

      default:
        this.navControl.navigateForward(['/' + paginaSeguinte]);
        break;
    }
  }

  async buscaCliente() {
    const modal = await this.modalCtrl.create({
      component: PesquisaClienteComponent,
      componentProps: {
        firstName: 'Douglas',
        lastName: 'Adams',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
  }
}
