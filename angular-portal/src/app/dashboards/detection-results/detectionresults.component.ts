import { Component, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

import { UploadModule } from '../../upload/upload.module'
import { DownloadService } from '../../upload/download.service';
@Component({
  selector: 'app-detectionresults',
  templateUrl: './detectionresults.component.html',
  styleUrls: ['./detectionresults.component.scss']
})
export class DetectionResultsComponent {

  detections = [];
 
  constructor(public downloadService: DownloadService ) {
    this.detections = downloadService.download()
  }
 
 
}