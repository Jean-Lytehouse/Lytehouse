import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentModule } from 'ngx-moment';
// Modules.
import { SharedMaterialModule } from './shared-material.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { UploadModule } from '../upload/upload.module'

// Components.
import { ExampleWithCodeComponent } from './example-with-code/example-with-code.component';

declare var hljs: any;

@NgModule({
  imports: [
    UploadModule,
    NgxUploaderModule,
    CommonModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedMaterialModule,
    MomentModule
  ],
  declarations: [
    ExampleWithCodeComponent
  ],
  exports: [
    UploadModule,
    NgxUploaderModule,
    CommonModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedMaterialModule,
    ExampleWithCodeComponent,
    MomentModule
  ]
})
export class SharedModule {
  constructor() {
    hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
    hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
    hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
  }
}

