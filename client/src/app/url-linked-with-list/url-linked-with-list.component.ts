import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LinkedUrl } from '../urlClasses';
import { UrlService } from '../url.service';
@Component({
  selector: 'app-url-linked-with-list',
  templateUrl: './url-linked-with-list.component.html',
  styleUrls: ['./url-linked-with-list.component.scss']
})
export class UrlLinkedWithListComponent implements OnInit {
 public url:any;
 public list=new Array<LinkedUrl>();
  
//  public list:any=[
//   {_id:"https://stackoverflow.com/questions/36637146/encode-string-to-hex",anchorText:"test1"},
//   {_id:"https://zeroesandones.medium.com/how-to-pass-data-from-parent-to-child-component-in-angular-9-dc7a0a64256c",anchorText:"test2"},
//   {_id:"https://stackoverflow.com/questions/1737935/what-is-the-recommended-way-to-pass-urls-as-url-parameters",anchorText:"test3"}
// ]

constructor(private router: Router,
  private linkedUrlService:UrlService
  ) {}

ngOnInit() {
    this.url=decodeURIComponent(decodeURIComponent(this.router.url.substring(1)));
    this.linkedUrlService.getLinkedUrl(this.url).subscribe(response => {
      response.forEach(item=>{
        this.list.push(item)
      })
    })
    
  }
}