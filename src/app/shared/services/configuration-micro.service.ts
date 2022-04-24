import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ConfigurationMicroService {
    private URL: string = window.location.origin + "/api";
    constructor() {
        if (window.location.host.includes("localhost")) {
            this.URL = "http://ec2-34-197-255-9.compute-1.amazonaws.com/api"; // QA
            // this.URL = "http://rj.tomtompodcast.com/api"; // QA  
            // this.URL = "http://ec2-15-207-52-38.ap-south-1.compute.amazonaws.com/api"; // Prodcution
        }
    }
    getUrl() {
        return this.URL;
    }

}