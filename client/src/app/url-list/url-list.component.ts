import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { response } from 'express';
import { UrlService } from '../url.service';
import { UrlCount,DomainUrl } from '../urlClasses';
@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.scss']
})
export class UrlListComponent implements OnInit {
 public domain=new Array<DomainUrl>()
  public p=1;
  public list =new Array<UrlCount>()
  public selectedDomain:any;
  public reset=false;

  constructor(private router: Router,
    private countUrlService:UrlService
    ) {}

  ngOnInit() {

    // tslint:disable-next-line:no-shadowed-variable
    this.countUrlService.getDomain().subscribe(response=>{
      response.forEach((item)=>{
        this.domain.push(item)
          })
    })
  }
  getUrlWithDomain(){
    console.log(this.selectedDomain);
    // tslint:disable-next-line:no-shadowed-variable
    this.countUrlService.getUrlCount(this.selectedDomain).subscribe(response=>{
      this.list=[];
      response.forEach((item)=>{
        this.list.push(item);
      })
    });
  }
  resetMap(){
    // tslint:disable-next-line:no-shadowed-variable
    this.countUrlService.resetMap().subscribe(response=>{
      console.log(response);
      this.reset=true;
    })
  }

  getDetails(data:any) {
    const meta=encodeURIComponent(data)
    this.router.navigate([meta])
  }
}
