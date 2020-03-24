import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Endereco, Sequence, CamposParaNovoEndereco } from 'src/app/class/cliente';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ConsultaEnderecoService } from 'src/app/services/entrega/consulta-endereco.service';

@Component({
  selector: 'app-endereco-entrega',
  templateUrl: './endereco-entrega.page.html',
  styleUrls: ['./endereco-entrega.page.scss'],
})
export class EnderecoEntregaPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  public novoEndereco: CamposParaNovoEndereco;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private common: CommonService,
    public pedidoService: PedidoService,
    private clienteService: ClienteService,
    private consultaEnderecoService: ConsultaEnderecoService,
    private navControl: NavController
  ) {
    this.novoEndereco = new CamposParaNovoEndereco;
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

  changeSlide(slide: number) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
  }

  getEnderecoByCEP(cep: string) {
    this.consultaEnderecoService.getEnderecoByCep(cep).then((result: any) => {
      this.novoEndereco.cep = this.common.formataCEP(cep);
      this.novoEndereco.endereco = result.logradouro;
      this.novoEndereco.bairro = result.bairro;
      this.novoEndereco.uf = result.estado;
      this.novoEndereco.cidade = result.cidade;
      console.log(result);
    });
  }

  async saveEndereco() {
    const novoEndereco: Endereco = {
      id: new Sequence,
      cd_status: 'L',
      tp_ende: 'ENTREGA',
      ds_ende: this.novoEndereco.endereco,
      nu_ende: this.novoEndereco.numero,
      ds_compl: this.novoEndereco.complemento,
      ds_bairro: this.novoEndereco.bairro,
      ds_cep: this.novoEndereco.cep,
      ds_uf: this.novoEndereco.uf,
      nu_praca: 0,
      ds_obs: '',
      nu_referencia_pessoal: '',
      cd_inscricao: '',
      usuario_cadastrou: '',
      latitude: '',
      longitude: ''
    }
    await this.common.showLoader();
    this.pedidoService.retornaDadosCliente().then(() => {
      let dados = this.pedidoService.dadosCliente;
      dados.enderecos.push(novoEndereco);
      this.gravaNovoEndereco(dados);
    });
  }

  // by Hélio, cadastra o novo endereco do cliente
  gravaNovoEndereco(cliente: any) {
    this.clienteService.postClienteAlteracao(cliente).then(() => {
      this.atualizaDadosCliente(this.pedidoService.pedidoHeader.cgccpf_cliente);
    }, () => {
      this.common.loading.dismiss();
    });
  }

  // by Hélio, pega os dados atualizados do cliente
  async atualizaDadosCliente(docCliente: string) {
    await this.clienteService.getClienteNoAlert(docCliente).then((result) => {
      this.pedidoService.dadosCliente = result;
      this.common.loading.dismiss();
      this.changeSlide(0);
    }, (error) => {
      this.common.loading.dismiss();
      // this.common.showAlert('Atenção!', 'Erro ao recuperar as informações do cliente.');
    });
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

      case 'pedido-atalhos':
        this.navControl.navigateRoot(['/' + paginaSeguinte]);
        break;

      default:
        this.navControl.navigateForward(['/' + paginaSeguinte]);
        break;
    }
  }

}
