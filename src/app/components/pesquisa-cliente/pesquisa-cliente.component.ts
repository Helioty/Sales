import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { IonInfiniteScroll, IonSearchbar, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Pagination } from 'src/app/page/pedido-lista/pedido-lista.interface';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pesquisa-cliente',
  templateUrl: './pesquisa-cliente.component.html',
  styleUrls: ['./pesquisa-cliente.component.scss'],
})
export class PesquisaClienteComponent implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) readonly infiniteScroll: IonInfiniteScroll;
  @ViewChild('pesquisarCliente') readonly searchbar: IonSearchbar;

  // Dados da Pesquisa reativa.
  private fieldSub: Subscription;
  readonly fieldPesquisa = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  // Controle de Loading.
  public showLoadingSpinner = false;

  // Dados da Pesquisa e Paginação
  public pagination: Pagination<ClienteGet>;
  private pesquisado = '';
  private page = 1;

  constructor(
    public readonly scanner: ScannerService,
    private readonly modalCtrl: ModalController,
    private readonly clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.fieldSub = this.fieldPesquisa.valueChanges
      .pipe(
        map((value: string) => value.trim()),
        filter((value: string) => value.length > 1),
        debounceTime(300),
        distinctUntilChanged(),
        tap({ next: () => (this.showLoadingSpinner = true) }),
        switchMap((value: string) => this.pesquisar(value)),
        tap({
          next: () => (this.showLoadingSpinner = false),
          error: () => (this.showLoadingSpinner = false),
        }),
        map((response: Pagination<ClienteGet>) => response.content)
      )
      .subscribe();
  }

  ionViewDidEnter(): void {
    this.setSearchbarFocus();
  }

  ngOnDestroy(): void {
    this.fieldSub.unsubscribe();
  }

  /**
   * @author helio.souza
   * @param value Dado a ser pesquisado.
   * @returns {Observable<Pagination<ClienteGet>>}
   */
  pesquisar(clie: string): Observable<Pagination<ClienteGet>> {
    return this.clienteService
      .getClientePesquisa(clie, this.pesquisado === clie ? this.page + 1 : 1)
      .pipe(
        map((response: Pagination<ClienteGet>) => this.mapPagination(response, clie)),
        tap({
          next: (result: Pagination<ClienteGet>) => {
            this.pesquisado = clie;
            this.pagination = result;
            console.log(`Valor pesquisado: ${clie}`);
            console.log('Resultado da pesquisa: ', result);
          },
        })
      );
  }

  /**
   * @author helio.souza
   * @param pagination Dados da paginação da pesquisa.
   * @param pesquisado Dado pesquisado.
   * @returns {Pagination<ClienteGet>}
   */
  mapPagination(
    pagination: Pagination<ClienteGet>,
    pesquisado: string
  ): Pagination<ClienteGet> {
    if (this.pagination && this.pesquisado === pesquisado) {
      pagination.content = [...this.pagination.content, ...pagination.content];
      this.page += 1;
    } else {
      this.infiniteScroll.disabled = false;
      this.page = 1;
    }
    return pagination;
  }

  /**
   * @author helio.souza
   * @param infinite IonInfinite Element.
   */
  doInfinite(infinite: any) {
    const infinit = infinite as IonInfiniteScroll;
    this.pesquisar(this.pesquisado)
      .pipe(
        take(1),
        tap({
          next: (response: Pagination<ClienteGet>) => {
            infinit.complete();
            infinit.disabled = response.last;
          },
          error: () => {
            infinit.complete();
          },
        })
      )
      .subscribe();
  }

  /**
   * @author helio.souza
   * @param selected Flag para informar se existe retorno. Default: false.
   * @param clie Dados do cliente selecionado.
   */
  close(selected = false, clie: ClienteGet = null): void {
    this.modalCtrl.dismiss({
      existePesquisa: selected,
      retorno: clie,
    });
  }

  /**
   * @author helio.souza
   * @param delay Delay para executar o foco no searchbar.
   */
  setSearchbarFocus(delay = 500): void {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, delay);
  }

  /**
   * @author helio.souza
   */
  blurSearchbar(): void {
    try {
      this.searchbar.getInputElement().then((search) => search.blur());
    } catch (error) {}
  }
}
