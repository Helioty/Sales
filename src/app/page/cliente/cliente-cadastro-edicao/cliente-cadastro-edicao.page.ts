import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cliente-cadastro-edicao',
  templateUrl: './cliente-cadastro-edicao.page.html',
  styleUrls: ['./cliente-cadastro-edicao.page.scss'],
})
export class ClienteCadastroEdicaoPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @ViewChild('slidesFooter', { static: true }) slidesFooter: IonSlides;

  // Controle do formulario
  public formCliente: FormGroup;
  public formEndereco: FormGroup;

  // Controle do Loading
  public loading = false;

  // Controle do cadastro
  public situacao = '';
  public cliente = '';

  // Dados do cliente
  private clienteDadosOld: any;

  constructor(
    public common: CommonService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.formCliente = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.email],
      celular: [''],
      telefone: [''],
    });
    this.formEndereco = this.formBuilder.group({
      cep: ['', Validators.required],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      comple: ['']
    });
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.activatedRoute.queryParams.subscribe(params => {
      this.situacao = params['situacao'];
      this.cliente = params['cliente'];
    });
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    if (this.situacao == 'edicao') {
      this.activatedRoute.queryParams.subscribe(params => {
        this.clienteDadosOld = JSON.parse(params['dados']);
      });
      console.log(this.clienteDadosOld);
    } else {
      
    }
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  async mudaSlide(slide: number) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
    this.slidesFooter.lockSwipes(false);
    this.slidesFooter.slideTo(slide);
    this.slidesFooter.lockSwipes(true);
  }

}
