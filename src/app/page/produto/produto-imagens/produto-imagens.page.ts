import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import { IProdutoImagem } from 'src/app/services/produto/produto.interface';

@Component({
  selector: 'app-produto-imagens',
  templateUrl: './produto-imagens.page.html',
  styleUrls: ['./produto-imagens.page.scss'],
})
export class ProdutoImagensPage implements OnInit {
  @ViewChild('imgSlides') readonly slides: IonSlides;
  public imagens: IProdutoImagem[] = [];

  readonly slideOpts = {
    slidesPerView: 5,
  };

  readonly dataId = 'produtoListImage';

  constructor(
    private readonly dataService: DataService,
    private readonly common: CommonService
  ) {}

  ngOnInit(): void {
    console.log('Produto Imagens OnInit');
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
    this.imagens = this.dataService.getData<IProdutoImagem[]>(this.dataId);
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.dataService.removeData(this.dataId);
  }

  /**
   * @author helio.souza
   * @description Navega ao slide coorespondente ao index.
   * @param slide Index do slide destino.
   */
  slideTo(slide: number): void {
    this.slides.slideTo(slide);
  }
}
