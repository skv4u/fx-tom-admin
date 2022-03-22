import { Component, Input, OnInit } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit {
  // @Input('msg') msg?:string = 'Loading....';
  constructor(public podcastService:ProdcastService) { }

  ngOnInit() {
  }

}
