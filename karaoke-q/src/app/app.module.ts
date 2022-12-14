import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

import { AppComponent } from './app.component';
import { SlipsComponent } from './slips/slips.component';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SongSearchComponent } from './song-search/song-search.component';
import { SlipDetailComponent } from './slip-detail/slip-detail.component';
import { SingersComponent } from './singers/singers.component';
import { UpdateLibraryComponent } from './update-library/update-library.component';
import { VideoComponentComponent } from './video-component/video-component.component';

import { CustomHttpInterceptor } from './http-interceptor';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ManageLibraryComponent } from './manage-library/manage-library.component';
import { SessionComponent } from './session/session.component';
import { ManageSessionsComponent } from './manage-sessions/manage-sessions.component';
import { EditSongComponent } from './edit-song/edit-song.component';


@NgModule({
  declarations: [
    AppComponent,
    SlipsComponent,
    SingerDetailComponent,
    DashboardComponent,
    SongSearchComponent,
    SlipDetailComponent,
    SingersComponent,
    UpdateLibraryComponent,
    VideoComponentComponent,
    ManageLibraryComponent,
    SessionComponent,
    ManageSessionsComponent,
    EditSongComponent,
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
    MatSortModule,
    MatProgressSpinnerModule,
    YouTubePlayerModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CustomHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
