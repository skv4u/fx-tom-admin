import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable()
export class ProdcastService {
editlist:any={}
CategoryList:any=[];
  constructor(public webservice:WebService) {
    this.getCategoryList();
   }
  getCategoryList() {
    this.webservice.commonMethod('category', '', 'GET').subscribe(
      (data) => {
        this.CategoryList = data.Response;
      })
  }
}
