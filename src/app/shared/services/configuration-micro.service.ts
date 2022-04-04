import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationMicroService {
  PROTOCOL: string = window.location.host.includes("localhost") ? 'http:' : window.location.protocol;
 private URL:any={
  "DEV":this.PROTOCOL + "//ec2-35-173-233-212.compute-1.amazonaws.com/api",
  "QA":this.PROTOCOL + "//ec2-35-173-233-212.compute-1.amazonaws.com/api", 
  "PROD":this.PROTOCOL + "//ec2-35-173-233-212.compute-1.amazonaws.com/api"
  };
  constructor() { }

  getUrl(){
    return this.URL;
  }
}
