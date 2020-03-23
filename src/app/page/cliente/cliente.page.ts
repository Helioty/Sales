import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { IonInput, NavController, AlertController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { BaseService } from 'src/app/services/base-service.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  @ViewChild('input', { static: false }) search: IonInput;

  // Valor digitado no input de CPF/CNPJ
  public valorDigitado = '';

  // Controle da animação do skeleton
  public skeletonAni = false;

  // Controle da cor do background // by Ryuge
  public isBlue = false;
  public isGreen = false;
  public isOrange = false;

  // Controle da pesquisa de CPF/CNPJ
  public isCNPJ = false;
  public atualizaCadastro = false;
  public novoCadastro = false;
  public mensagem = '';
  public isActive = '';

  // Dados do cliente.
  public dados: any;
  public dadosShow: any = { nome: '', endereco: '', celular: '', email: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private common: CommonService,
    private baseService: BaseService,
    private clienteService: ClienteService,
    private navControl: NavController,
    private pedidoService: PedidoService,
    private renderer: Renderer
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    if (this.pedidoService.clientSelected && this.pedidoService.docCliente !== '') {
      this.getClienteAntesSelecionado();
    } else if (this.valorDigitado === '') {
      this.setEstado('reset');
    }
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
    if (this.isBlue) {
      this.foco();
    }
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

  foco() {
    setTimeout(() => {
      this.search.setFocus();
    }, 350);
  }

  blur(evento: any) {
    this.renderer.invokeElementMethod(evento.target, 'blur');
  }

  // by Helio 12/02/2020
  async getClienteAntesSelecionado() {
    await this.pedidoService.retornaDadosCliente().then(() => {
      this.dados = this.pedidoService.dadosCliente;
      this.valorDigitado = this.common.formataCPFNPJ(this.pedidoService.docCliente);
      this.isCNPJ = this.dados.natureza !== 'FISICA';
      this.isActive = this.dados.ativo;
      this.atualizaCadastro = this.dados.atualizaCadastro;
      this.showDados(this.dados);
    });

    if (this.atualizaCadastro) {
      this.setEstado('atualizacao');
    } else {
      this.setEstado('confirmacao');
    }
  }

  // by Hélio
  setCor(cor: string) {
    switch (cor) {
      case 'blue':
        this.isBlue = true;
        this.isGreen = false;
        this.isOrange = false;
        break;

      case 'green':
        this.isBlue = false;
        this.isGreen = true;
        this.isOrange = false;
        break;

      case 'orange':
        this.isBlue = false;
        this.isGreen = false;
        this.isOrange = true;
        break;

      default:
        break;
    }
  }

  // by Helio 08/10/2019
  // mascara dinamica
  dynamicMask(inputName: string) {
    if (this.valorDigitado.length > 2) {
      if (inputName === 'cli') {
        if (this.valorDigitado !== '' || this.valorDigitado !== undefined) {
          this.valorDigitado = this.common.formataCPFNPJ(this.valorDigitado);
        }
      }
    }
  }

  // by Hélio
  setEstado(estado: string) {
    switch (estado) {
      case 'atualizacao':
        this.skeletonAni = false;
        this.atualizaCadastro = true;
        this.novoCadastro = false;
        this.setCor('green');
        break;

      case 'confirmacao':
        this.skeletonAni = false;
        this.atualizaCadastro = false;
        this.novoCadastro = false;
        this.setCor('green');
        break;

      case 'novo':
        this.skeletonAni = false;
        this.atualizaCadastro = false;
        this.novoCadastro = true;
        this.setCor('orange');
        break;

      case 'reset':
        this.dados = undefined;
        this.skeletonAni = false;
        this.atualizaCadastro = false;
        this.novoCadastro = false;
        this.isCNPJ = false;
        this.isActive = '';
        this.dadosShow.nome = '';
        this.dadosShow.endereco = '';
        this.dadosShow.celular = '';
        this.dadosShow.email = '';
        this.setCor('blue');
        setTimeout(() => {
          this.foco();
        }, 250);
        break;

      default:
        break;
    }
  }

  // Checa o minimo de caracteres necessarios para executar a chamada.
  checaMinimo(doc: string) {
    this.common.goToFullScreen();
    const clieDoc: string = doc.replace(/\D/g, '');
    if (clieDoc.length > 10) {
      this.getCliente(clieDoc);
    }
  }

  // Chamada de cliente.
  async getCliente(doc: string) {
    this.skeletonAni = true;

    await this.clienteService.getCliente(doc).then((result: any) => {
      this.dados = result;
      console.log('DADOS DO CLIENTE');
      console.log(this.dados);
      if (this.dados !== undefined || this.dados !== [] || this.dados !== '') {
        this.isCNPJ = this.dados.natureza !== 'FISICA';
        this.isActive = this.dados.ativo;
        this.atualizaCadastro = this.dados.atualizaCadastro;
        this.showDados(this.dados);
        if (this.atualizaCadastro) {
          this.setEstado('atualizacao');
        } else {
          this.setEstado('confirmacao');
        }
      } else {
        this.dados = undefined;
        this.skeletonAni = false;
      }
    }, (error: any) => {
      if (error.error.detail) {
        this.mensagem = 'Não encontramos o cadastro do cliente!';
        this.skeletonAni = false;
        this.setEstado('novo');
      } else {
        this.skeletonAni = false;
        this.setEstado('reset');
      }
    });
  }

  showDados(dados: any) {
    this.dadosShow.nome = dados.nome;

    // by Hélio 11/02/2020
    if (dados.numero !== null && dados.numero !== undefined) {
      this.dadosShow.endereco = dados.endereco + ', ' + dados.numero;
    } else {
      this.dadosShow.endereco = dados.endereco;
    }

    // by Ryuge 17/09/2019
    if (this.dados.emails.length > 0) {
      const valor0: any = String(dados.emails[0].email_site);
      if (valor0 !== null || valor0 !== '') {
        this.dadosShow.email = dados.emails[0].email_site;
      }
    }

    // by Ryuge 17/09/2019
    if (this.dados.celulares.length > 0) {
      const valor1: any = String(dados.celulares[0].numero);

      if (valor1.length > 8) {
        this.dadosShow.celular = this.common.formataFONE(dados.celulares[0].ddd + dados.celulares[0].numero);
      } else {
        this.dadosShow.celular = '';
      }
    }
  }

  async naoCliente() {
    if (this.pedidoService.clientSelected) {
      const alert = await this.alertCtrl.create({
        header: 'Remover cliente?',
        message: 'Deseja remover o cliente do pedido atual?',
        buttons: ['NÃO', {
          text: 'SIM',
          handler: () => {
            this.common.showLoader();
            this.pedidoService.removerCliente().then(() => {
              this.setEstado('reset');
              this.common.loading.dismiss();
            });
          }
        }]
      });
      await alert.present();
    } else {
      this.setEstado('reset');
    }
  }

  async cadastrarNovo() {
    let navParams: any;
    this.activatedRoute.queryParams.subscribe(params => {
      navParams = params;
    });
    this.toCadastroEdicao(navParams, 'novo');
  }

  async editarCadastro() {
    let navParams: any;
    this.activatedRoute.queryParams.subscribe(params => {
      navParams = params;
    });
    this.toCadastroEdicao(navParams, 'edicao');
  }

  // by Hélio 14/02/2020, controla a navegação para a tela de cadastro/edição
  async toCadastroEdicao(navParams: any, situacao: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: '',
        paginaAnterior: '',
        situacao: situacao,
        cliente: this.valorDigitado,
        dados: ''
      }
    };
    if (situacao === 'edicao') {
      navigationExtras.queryParams.dados = JSON.stringify(this.dados);
    }
    switch (navParams.paginaAnterior) {
      case 'pedido-retirada':
        navigationExtras.queryParams.paginaSeguinte = 'produto-atalhos';
        navigationExtras.queryParams.paginaAnterior = 'pedido-retirada';
        this.navControl.navigateForward(['/cliente-cadastro-edicao'], navigationExtras);
        break;

      default:
        navigationExtras.queryParams.paginaSeguinte = navParams.paginaAnterior;
        navigationExtras.queryParams.paginaAnterior = 'back';
        this.navControl.navigateForward(['/cliente-cadastro-edicao'], navigationExtras);
        break;
    }
  }

  async confirmaCliente() {
    await this.common.showLoader();
    const doc: string = this.valorDigitado.replace(/\D/g, '');
    if (doc !== this.pedidoService.docCliente) {
      this.pedidoService.adicionarCliente(doc, this.dados).then(() => {
        if (this.pedidoService.clientSelected) {
          this.prosseguir();
        }
        this.common.loading.dismiss();
      }, (error) => {
        console.log(error);
        this.common.loading.dismiss();
      });
    } else {
      await this.prosseguir();
      this.common.loading.dismiss();
    }

  }

  async prosseguir() {
    let paginaSeguinte: any;
    this.activatedRoute.queryParams.subscribe((params: any) => {
      paginaSeguinte = params.paginaSeguinte;
    });
    switch (paginaSeguinte) {
      case 'back':
        this.navControl.pop();
        break;

      default:
        this.navControl.navigateForward(['/' + paginaSeguinte]);
        break;
    }
  }

}
