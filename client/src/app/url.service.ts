import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UrlCount,LinkedUrl,DomainUrl } from './urlClasses';
@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private baseUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getUrlCount(domain:any): Observable<UrlCount[]>{
    return this.http.get<UrlCount[]>(this.baseUrl+"getUrlCount?domain="+domain);
  }

  getLinkedUrl(url:any): Observable<LinkedUrl[]>{
    return this.http.get<LinkedUrl[]>(this.baseUrl+"getLinkedUrls?url="+url)
  }

  getDomain(): Observable<DomainUrl[]>{
    return this.http.get<DomainUrl[]>(this.baseUrl+"getAllDomain")
  }

  resetMap(): Observable<any>{
    return this.http.get(this.baseUrl+"resetMap");
  }
}
