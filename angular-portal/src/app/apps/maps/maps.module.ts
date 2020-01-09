import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from './../../shared/shared.module';

import { MapsComponent } from './maps/maps.component';

@NgModule({
  imports: [
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC6XwsI4T7ejuzYXZOkgSrh4b8MHN2En_o'
    }),
  ],
  declarations: [MapsComponent]
})
export class MapsModule { }
