import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectDomainComponent } from './select-domain/select-domain.component';
import { UrlListComponent } from './url-list/url-list.component';
import {NgxPaginationModule} from 'ngx-pagination'
import { UrlLinkedWithListComponent } from './url-linked-with-list/url-linked-with-list.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    SelectDomainComponent,
    UrlListComponent,
    UrlLinkedWithListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
