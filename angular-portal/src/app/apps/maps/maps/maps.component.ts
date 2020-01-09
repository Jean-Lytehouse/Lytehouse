import { Component, OnInit } from '@angular/core';

import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  lat: number;
  lng: number;
  map: any;
  activeMarker: AnyMarker;
  markers: Marker[];
  activeAlert: Alert;
  alerts: Alert[];
  sites: Site[];

  styles: any[] = [
    {
      'featureType': 'administrative.country',
      'elementType': 'geometry',
      'stylers': [
        {
          'visibility': 'simplified'
        },
        {
          'hue': '#ff0000'
        }
      ]
    }
  ];
  constructor(private http: HttpClient) {
    this.lat = -26.109630;
    this.lng = 27.795960;
    this.http.get<Marker[]>('assets/data/apps/maps/maps.json')
      .subscribe(markers => this.markers = markers);
    this.http.get<Alert[]>('assets/data/apps/maps/alerts.json')
      .subscribe(alerts => this.alerts = alerts);
    this.http.get<Site[]>('assets/data/apps/maps/sites.json')
      .subscribe(sites => this.sites = sites);
  }

  ngOnInit(): void {
  }

  onMapReady(map: any): void {
    this.map = map;
  }

  onMarkerClick(marker: any): void {
    this.map.panTo(marker);
    this.activeMarker = marker;
    this.markers.forEach(m => m.isOpen = m === marker);
  }
}

interface Marker {
  lat: number;
  lng: number;
  isOpen: boolean;
}

interface Site extends Marker {
  owner: string;
  photo: string;
  description: string;
  sensors: number;
  name: string;
  address: string;
}

interface Alert extends Marker, Site {
  isConfirmed: boolean;
  isResolved: boolean;
  type: string;
  sensor: string;
  confidence: string;
}

interface AnyMarker extends Marker, Site, Alert {

}