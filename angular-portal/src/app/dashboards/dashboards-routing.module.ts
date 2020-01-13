import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { DashboardComponent } from './analytics/analytics.component';
import { DetectionDemoComponent } from './detection-demo/detectiondemo.component';
import { DetectionResultsComponent } from './detection-results/detectionresults.component';



const routes: Routes = [{
  path: 'analytics',
  component: DashboardComponent,
  data: {
    title: 'Analytics Dashboard'
  }
}, {
  path: 'detection-demo',
  component: DetectionDemoComponent,
  data: {
    title: 'Detecting Compliance Issues With Computer Vision'
  }
}, {
  path: 'detection-results',
  component: DetectionResultsComponent,
  data: {
    title: 'Detection Results'
  }
}];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
