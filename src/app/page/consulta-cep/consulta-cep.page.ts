import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CommonService } from 'src/app/services/common/common.service';
import { IonSearchbar, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-consulta-cep',
  templateUrl: './consulta-cep.page.html',
  styleUrls: ['./consulta-cep.page.scss'],
})
export class ConsultaCepPage implements OnInit, AfterContentInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  @ViewChild('mapElement', { static: false }) mapElement: { nativeElement: any; };
  public map: any;
  public start: string;
  public end: string;

  public latitude: any;
  public longitude: any;

  public GoogleAutocomplete: any;
  public geocoder: any;


  public directionsService = new google.maps.DirectionsService();
  public directionsDisplay = new google.maps.DirectionsRenderer();
  public latLng: any;


  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

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
    public common: CommonService,
    private geolocation: Geolocation,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
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
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
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

}
