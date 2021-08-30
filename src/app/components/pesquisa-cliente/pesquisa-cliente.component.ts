import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';
import { ScannerService } from 'src/app/services/scanner/scanner.service';

@Component({
  selector: 'app-pesquisa-cliente',
  templateUrl: './pesquisa-cliente.component.html',
  styleUrls: ['./pesquisa-cliente.component.scss'],
})
export class PesquisaClienteComponent implements OnInit, OnDestroy {
  @ViewChild('pesquisarCliente', { static: true }) readonly searchbar: IonSearchbar;
  // Dados da Pesquisa reativa.
  private fieldSub: Subscription;
  readonly fieldPesquisa = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  // Data passed in by componentProps
  @Input() firstName: string;
  @Input() lastName: string;

  constructor(
    public readonly scanner: ScannerService,
    private readonly modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.fieldSub = this.fieldPesquisa.valueChanges.pipe().subscribe();
  }

  ngOnDestroy(): void {
    this.fieldSub.unsubscribe();
  }

  /**
   * @author helio.souza
   * @param selected
   * @param clie
   */
  close(selected = false, clie: ClienteGet = null): void {
    this.modalCtrl.dismiss({
      existePesquisa: selected,
      retorna: clie,
    });
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
