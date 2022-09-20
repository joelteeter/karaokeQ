import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

import { AppComponent } from './app.component';
import { SlipsComponent } from './slips/slips.component';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { LogsComponent } from './logs/logs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SongSearchComponent } from './song-search/song-search.component';
import { SlipDetailComponent } from './slip-detail/slip-detail.component';
import { SingersComponent } from './singers/singers.component';
import { UpdateLibraryComponent } from './update-library/update-library.component';
import { VideoComponentComponent } from './video-component/video-component.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ManageLibraryComponent } from './manage-library/manage-library.component';


@NgModule({
  declarations: [
    AppComponent,
    SlipsComponent,
    SingerDetailComponent,
    LogsComponent,
    DashboardComponent,
    SongSearchComponent,
    SlipDetailComponent,
    SingersComponent,
    UpdateLibraryComponent,
    VideoComponentComponent,
    ManageLibraryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { 
        dataEncapsulation: false,
        passThruUnknownUrl: true }
    ),
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatCheckboxModule,
    MatTableModule,
    YouTubePlayerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
