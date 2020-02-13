import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseCommon } from 'src/commons/base-common';
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
  @ViewChild("slidesFooter", { static: true }) slidesFooter: IonSlides;

  // Controle do formulario
  public formCliente: FormGroup;

  // Controle do Loading
  public loading: boolean = false;

  // Controle do cadastro
  public situacao: string = "";
  public cliente: string = "";

  constructor(
    public common: BaseCommon,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.formCliente = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.email],
      celular: [''],
      telefone: [''],
    });
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.activatedRoute.queryParams.subscribe(params => {
      this.situacao = params["situacao"];
      this.cliente = params["cliente"];
    });
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
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
