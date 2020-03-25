import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CommonService } from 'src/app/services/common/common.service';
import { IonSearchbar, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CamposParaNovoEndereco } from 'src/app/class/cliente';

declare var google: any;

@Component({
  selector: 'app-consulta-cep',
  templateUrl: './consulta-cep.page.html',
  styleUrls: ['./consulta-cep.page.scss'],
})
export class ConsultaCepPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  @ViewChild('mapElement', { static: false }) mapElement: { nativeElement: any; };

  public map: any;
  // public start: string;
  // public end: string;

  // public latitude: any;
  // public longitude: any;

  // public directionsService = new google.maps.DirectionsService();
  // public directionsDisplay = new google.maps.DirectionsRenderer();
  // public latLng: any;


  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;
  public autoCompleteList: any[] = [];
  public markers: any[] = [];

  public googleAutocomplete = new google.maps.places.AutocompleteService();
  public geocoder = new google.maps.Geocoder();;

  public foco = false; // controla o foco no searchbar

  public modoConsulta = true; // controla o modo da pagina se é apenas consulta ou não.
  public progressBar = false; // controla o a barra de progresso.

  public enderecoSelecionado: CamposParaNovoEndereco;

  constructor(
    private router: ActivatedRoute,
    public common: CommonService,
    private geolocation: Geolocation,
  ) {
    this.enderecoSelecionado = new CamposParaNovoEndereco;
  }

  ngOnInit() {
    this.router.paramMap.subscribe((params: any) => {
      console.log(params.params.mode);
      if (params.params.mode !== 'consulta') {
        this.modoConsulta = false;
      }
    });
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.slides.lockSwipes(true);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: -8.1129892, lng: -34.9126349 },
      disableDefaultUI: true,
      zoom: 15
    });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  changeSlide(slide: number) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
  }

  // edit by Helio 25/03/2020
  updateSearchResults() {
    if (!this.foco) {
      return;
    }
    if (this.searchbar.value === '') {
      this.autoCompleteList = [];
      return;
    }
    this.googleAutocomplete.getPlacePredictions(
      {
        input: this.searchbar.value,
        componentRestrictions: { country: ["br"] }
      },
      (predictions: any, status) => {
        this.autoCompleteList = [];
        if (predictions) {
          predictions.forEach((prediction: any) => {
            this.autoCompleteList.push(prediction);
          });
        }
      }
    );
  }

  // edit by Helio 25/03/2020
  selectSearchResult(item: any) {
    this.progressBar = true;
    console.log('ENTREI x AQUI!');

    this.autoCompleteList = [];
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.progressBar = false;
        this.insereMarker(results[0].geometry.location);
        this.searchbar.value = item.description;
      } else {
        this.progressBar = false;
      }
    });
  }

  insereMarker(latlng: any) {
    this.clearLocations();
    const marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      visible: true
    });
    this.markers.push(marker);
    this.map.setCenter(latlng);
  }

  // clear markers before starting new search
  clearLocations() {
    for (let mark of this.markers) {
      mark.setMap(null);
    }
    if (this.markers.length > 20) {
      this.markers = [];
    }
  }

  confirmaLocal() {
    this.progressBar = true;
    this.getAddressGoogleMap();
  }

  getAddressGoogleMap() {
    this.geocoder.geocode(
      { latLng: this.markers[this.markers.length - 1].getPosition() },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          this.insereMarker(results[0].geometry.location);
          this.showResultGoogleMap(results[0].address_components);
          this.changeSlide(1);
          this.progressBar = false;
        } else {
          this.progressBar = false;
        }
      });
  }

  showResultGoogleMap(item: any) {
    if (item.length === 7) {
      console.log('CONSULTA GOOGLE MAP');
      console.log(item);

      this.enderecoSelecionado.endereco = item[1].long_name;
      this.enderecoSelecionado.bairro = item[2].long_name;
      this.enderecoSelecionado.cidade = item[3].long_name;
      this.enderecoSelecionado.uf = item[4].short_name;
      this.enderecoSelecionado.cep = item[6].long_name;
    }
    if (item.length === 6) {
      console.log('CEP GENERICO');
      console.log(item);

      this.enderecoSelecionado.endereco = item[0].long_name;
      this.enderecoSelecionado.bairro = item[1].long_name;
      this.enderecoSelecionado.cidade = item[2].long_name;
      this.enderecoSelecionado.uf = item[3].short_name;
      this.enderecoSelecionado.cep = item[5].long_name;
    }
    if (item.length === 5) {
      console.log('CEP GENERICO');
      console.log(item);

      this.enderecoSelecionado.endereco = item[1].long_name;
      // this.enderecoSelecionado.bairro = item[2].long_name;
      this.enderecoSelecionado.cidade = item[2].long_name;
      this.enderecoSelecionado.uf = item[3].short_name;
      this.enderecoSelecionado.cep = item[4].long_name;
    }
  }


}
