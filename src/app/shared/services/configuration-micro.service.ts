import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationMicroService {
 private URL:any={
  "DEV":"http://ec2-35-173-233-212.compute-1.amazonaws.com/api",
  "QA":"http://ec2-35-173-233-212.compute-1.amazonaws.com/api", 
  "PROD":"http://ec2-35-173-233-212.compute-1.amazonaws.com/api"
  };
  constructor() { }

  getUrl(){
    return this.URL;
  }

}
