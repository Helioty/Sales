import { IonSlides } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-imagens',
  templateUrl: './produto-imagens.page.html',
  styleUrls: ['./produto-imagens.page.scss'],
})
export class ProdutoImagensPage implements OnInit {
  @ViewChild('imgSlides') slides: IonSlides;

  public imagens = [];

  public slideOpts = {
    slidesPerView: 5,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    public common: CommonService,
    public produtoService: ProdutoService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.imagens = this.dataService.getData(params.dataId);
    });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    console.clear();
  }

  ionViewDidLeave() {}

  slideTo(slide: number) {
    this.slides.slideTo(slide);
  }
}
