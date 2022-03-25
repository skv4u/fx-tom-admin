import { Component } from '@angular/core';
import { LocalstorageService } from './shared/services/localstorage.service';
import { ProdcastService } from './shared/services/prodcast.service';
import { WebService } from './shared/services/web.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tomtom';
  constructor(public localStorage: LocalstorageService, public WebService: WebService,public ProdcastService:ProdcastService) {
    this.ProdcastService.loader=false;
  }
  
}
