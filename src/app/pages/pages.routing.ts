import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

/**
 * COMPONENTES
 */
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { OfflineComponent } from './offline/offline.component';
import { TwitterComponent } from './twitter/twitter.component';
import { TraceExecutionComponent } from './trace-execution/trace-execution.component';
import { UserEvaluationComponent } from './user-evaluation/user-evaluation.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
          {
            path: '',
            component: HomeComponent, data: { title: 'Home' }
            
          },
          {
            path: 'offline',
            component: OfflineComponent, data: { title: 'Offline Case' }
            
          },
          {
            path: 'twitter',
            component: TwitterComponent, data: { title: 'Twitter Case' }
            
          },
          {
            path: 'trace-execute',
            component: TraceExecutionComponent, data: { title: 'Trace Exec. Case' }
            
          },
          {
            path: 'user-evaluation',
            component: UserEvaluationComponent, data: { title: 'Usr. Eval.' }
            
          },
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ]
  })
export class PagesRoutingModule { }