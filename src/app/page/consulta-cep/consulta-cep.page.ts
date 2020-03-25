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
    // await this.common.showLoader();
    this.progressBar = true;
    console.log('ENTREI x AQUI!');

    this.autoCompleteList = [];
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        // this.common.loading.dismiss();
        this.progressBar = false;
        this.insereMarker(results[0].geometry.location);
        this.searchbar.value = item.description;
      } else {
        // this.common.loading.dismiss();
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


}
