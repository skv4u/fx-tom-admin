import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationMicroService {
 private URL:any={
    "DEV":"",
    "QA":"",
    "PROD":""
  };
  constructor() { }

  getUrl(){
    return this.URL;
  }

}
