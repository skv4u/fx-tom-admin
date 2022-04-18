import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ConfigurationMicroService {
    private URL: string = window.location.origin + "/api";
    constructor() {
        if (window.location.host.includes("localhost")) {
            this.URL = "http://ec2-35-173-233-212.compute-1.amazonaws.com/api"; // Prodcution
            // this.URL = "http://rj.tomtompodcast.com/api"; // Production  
            // this.URL = "http://ec2-15-207-52-38.ap-south-1.compute.amazonaws.com/api"; // QA
        }
    }
    getUrl() {
        return this.URL;
    }

}