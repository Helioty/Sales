import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BaseCommon } from '../../../commons/base-common';

declare var google: any;

@Component({
  selector: 'app-consulta-cep',
  templateUrl: './consulta-cep.page.html',
  styleUrls: ['./consulta-cep.page.scss'],
})
export class ConsultaCepPage implements OnInit {

  @ViewChild("map", { static: false }) mapElement;

  public GoogleAutocomplete: any;

  public map: any;
  public start: string;
  public end: string;

  public directionsService = new google.maps.DirectionsService();
  public directionsDisplay = new google.maps.DirectionsRenderer();
  public latLng: any;

  constructor(
    public common: BaseCommon,
    public geolocation: Geolocation,
  ) { 
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  ngOnInit() {
    this.latLng = new google.maps.LatLng(-8.1129892, -34.9126349);
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: this.latLng,
      disableDefaultUI: true
    });
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.common.goToFullScreen()
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.common.goToFullScreen()
  }

}
