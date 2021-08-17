import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { IonContent, IonSlides, NavController } from '@ionic/angular';
import { switchMap, tap } from 'rxjs/operators';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-cliente-cadastro-edicao',
  templateUrl: './cliente-cadastro-edicao.page.html',
  styleUrls: ['./cliente-cadastro-edicao.page.scss'],
})
export class ClienteCadastroEdicaoPage implements OnInit {
  @ViewChild(IonContent, { static: true }) readonly content: IonContent;
  @ViewChild(IonSlides, { static: true }) readonly slides: IonSlides;

  // Controle do formulario
  public formCliente: FormGroup;
  public formEndereco: FormGroup;

  // Controle do Loading
  public loading = false;

  // Controle do cadastro
  public situacao = '';
  public cliente = '';

  // Dados do cliente
  private clienteDadosOld: ClienteGet;

  // Dados da navegação.
  private navParams: Params;

  constructor(
    private readonly common: CommonService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly navControl: NavController
  ) {}

  ngOnInit(): void {
    this.setFormCliente();
    this.setFormEndereco();
    this.getNavParams();
    this.slides.lockSwipes(true);
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
    // this.getExiteEnderecoSelecionado();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  /**
   * @author helio.souza
   */
  getNavParams(): void {
    this.activatedRoute.params
      .pipe(
        tap({
          next: (params) => (this.cliente = params.doc),
        }),
        switchMap(() => this.activatedRoute.queryParams),
        tap({
          next: (params) => {
            this.navParams = params;
            console.log('queryParams: ', params);
            this.situacao = params.situacao;
            if (this.situacao === 'edicao') {
              this.clienteDadosOld = JSON.parse(params.dados);
              console.log(this.clienteDadosOld);
              this.updateFormCliente(this.clienteDadosOld);
              this.updateFormEndereco(this.clienteDadosOld);
            }
          },
        })
      )
      .subscribe();
  }

  /**
   * @author helio.souza
   */
  setFormCliente(): void {
    this.formCliente = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.email],
      celular: [''],
      telefone: [''],
    });
  }

  updateFormCliente(newValue: any): void {
    this.formCliente.patchValue({});
  }

  /**
   * @author helio.souza
   */
  setFormEndereco(): void {
    this.formEndereco = this.formBuilder.group({
      cep: ['', Validators.required],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      comple: [''],
    });
  }

  updateFormEndereco(newValue: any): void {
    this.formEndereco.patchValue({});
  }

  /**
   * @author helio.souza
   * @param slide
   */
  slideTo(slide: number): void {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
  }

  pesquisaCep() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'cliente-cadastro-edicao',
      },
    };
    this.navControl.navigateForward(['/consulta-cep/pesquisa'], navigationExtras);
  }

  // by Helio, usado para retornar os dados de um endereço da tela 'consulta-cep'
  // getExiteEnderecoSelecionado() {
  //   const existeEndereco = this.data['exiteEnderecoSelecionado'];
  //   if (existeEndereco) {
  //     console.log('Exite um endereço selecionado');
  //     console.log(this.data['enderecoSelecionado']);
  //   }
  // }
}
