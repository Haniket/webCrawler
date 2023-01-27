import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UrlLinkedWithListComponent } from './url-linked-with-list/url-linked-with-list.component';
import { UrlListComponent } from './url-list/url-list.component';
const routes: Routes = [
  {
    path: '', component: AppComponent ,  children: [
      { path: '', component: UrlListComponent },
  { path: ':url', component: UrlLinkedWithListComponent}]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
