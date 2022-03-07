import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';

@Component({
  selector: 'app-generic-header',
  templateUrl: './generic-header.component.html',
  styleUrls: ['./generic-header.component.scss']
})
export class GenericHeaderComponent implements OnInit {

  constructor(public prodcastService:ProdcastService,public router:Router) { }

  ngOnInit() {
  }
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login')
  }
}
