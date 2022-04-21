import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  search: string = "";
  podcastList: any[] = [{
    "id": 1,
    "Name": "Chaitanya",
    "Description": "Comdey Story",
    "Image": "",
    "Active": false
  },{
    "id": 2,
    "Name": "Praveen",
    "Description": "Romatic Story",
    "Image": "",
    "Active": false
  },{
    "id": 3,
    "Name": "Santosh",
    "Description": "love Story",
    "Image": "",
    "Active": false
  }]
  constructor(public router: Router) { }

  ngOnInit() {
  }
  loadSelectedPodcast(elem: any){
    for (let a of this.podcastList) {
      a.Active = false;
    }
    elem.Active = true;
  }
}
