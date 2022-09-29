import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionComponent } from './session/session.component';
import { ManageSessionsComponent } from './manage-sessions/manage-sessions.component';

const routes: Routes = [

    { path: '', component:SessionComponent },
    { path: 'session/:id', component:DashboardComponent },
    { path: 'managesessions', component:ManageSessionsComponent}
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
