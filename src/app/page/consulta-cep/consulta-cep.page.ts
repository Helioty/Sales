import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CommonService } from 'src/app/services/common/common.service';
import { IonSearchbar, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-consulta-cep',
  templateUrl: './consulta-cep.page.html',
  styleUrls: ['./consulta-cep.page.scss'],
})
export class ConsultaCepPage implements OnInit, AfterContentInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  @ViewChild('mapElement', { static: false }) mapElement: { nativeElement: any; };
  directionForm: FormGroup;

  public map: any;
  public start: string;
  public end: string;

  public latitude: any;
  public longitude: any;

  public geocoder: any;


  public directionsService = new google.maps.DirectionsService();
  public directionsDisplay = new google.maps.DirectionsRenderer();
  public latLng: any;


  public googleAutocomplete = new google.maps.places.AutocompleteService();
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;
  public autoCompleteList: any[] = [];

  // controla o foco no searchbar
  public foco = false;

  public modoConsulta = true; // controla o modo da pagina se é apenas consulta ou não.
  public progressBar = false; // controla o a barra de progresso.

  public enderecoSelecionado = {
    cep: '',
    estado: '',
    endere: '',
    numero: '',
    comple: '',
    bairro: '',
    cidade: ''
  };

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    public common: CommonService,
    private geolocation: Geolocation,
  ) {
    this.googleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    // this.createDirectionForm();
  }

  ngOnInit() {
    this.router.paramMap.subscribe((params: any) => {
      console.log(params.params.mode);
      if (params.params.mode !== 'consulta') {
        this.modoConsulta = false;
      }
    });
  }

  ngAfterContentInit(): void {

  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.slides.lockSwipes(true);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: -8.1129892, lng: -34.9126349 },
      disableDefaultUI: true,
      zoom: 15
    });
    // const infowindow = new google.maps.InfoWindow();
    // const infowindowContent = document.getElementById('infowindow-content');
    // infowindow.setContent(infowindowContent);
    // const marker = new google.maps.Marker({
    //   map: this.map,
    //   anchorPoint: new google.maps.Point(0, -29)
    // });
    // const inputElement: any = this.searchbar.getInputElement();
    // const autocomplete = new google.maps.places.Autocomplete(inputElement as HTMLInputElement);
    // autocomplete.addListener('place_changed', () => {
    //   infowindow.close();
    //   marker.setVisible(false);
    //   const place = autocomplete.getPlace();
    //   if (!place.geometry) {
    //     // User entered the name of a Place that was not suggested and
    //     // pressed the Enter key, or the Place Details request failed.
    //     window.alert('No details available for input: ' + place.name);
    //     return;
    //   }
    //   if (place.geometry.viewport) {
    //     this.map.fitBounds(place.geometry.viewport);
    //   } else {
    //     this.map.setCenter(place.geometry.location);
    //     this.map.setZoom(17);  // Why 17? Because it looks good.
    //   }
    //   marker.setPosition(place.geometry.location);
    //   marker.setVisible(true);
    //   let address = '';
    //   if (place.address_components) {
    //     address = [
    //       (place.address_components[0] && place.address_components[0].short_name || ''),
    //       (place.address_components[1] && place.address_components[1].short_name || ''),
    //       (place.address_components[2] && place.address_components[2].short_name || '')
    //     ].join(' ');
    //   }
    //   infowindowContent.children['place-icon'].src = place.icon;
    //   infowindowContent.children['place-name'].textContent = place.name;
    //   infowindowContent.children['place-address'].textContent = address;
    //   infowindow.open(this.map, marker);
    // });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      placeName: [''],
    });
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
            console.log(this.autoCompleteList);
          });
        }
      }
    );
  }



}
