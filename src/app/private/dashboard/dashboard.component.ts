import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showhidecnd:any={
    "showEdit":false,
    "ShowFilter":false,
    "showBell":false,
    "showEmail":false
  }
  dashboardList: any = [{
    "RJName": "Bhanu",
    "Picture": "assets/images/login-img.jpg",
    "Title": "Podcast 25",
    "AboutTitle": "About the Prodcast25",
    "Category": "Comedy,Politics",
    "UpoladDate": "25-01-2022",
    "UploadTime": "12:15",
    "Status": "Live",
    "StatusCode": "live",
    "BroadCastData": "25-01-2022",
    "BroadCastDataTime": "20:30",
    "Comments": "None",
    "Edit": true,
    "Delete": false,
    "ShowProcastComment": false,
    "ShowstatusDropDown": false
  },
  {
    "RJName": "Chaitanya",
    "Picture": "assets/images/login-img.jpg",
    "Title": "Podcast 87",
    "AboutTitle": "About the Prodcast87",
    "Category": "News",
    "UpoladDate": "14-09-2022",
    "UploadTime": "12:15",
    "Status": "Approved",
    "StatusCode": "approved",
    "BroadCastData": "14-09-2022",
    "BroadCastDataTime": "20:30",
    "Comments": "None",
    "Edit": true,
    "Delete": false,
    "ShowProcastComment": false,
    "ShowstatusDropDown": false
  }];
  constructor(public router: Router) { }

  ngOnInit() {
  }

}
