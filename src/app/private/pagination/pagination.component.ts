import { Component, OnInit } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';

@Component({
  selector: 'app-pagination',
  template: `<div class="pagination">
    <div class="dropdown">
    <span>
      Page Size
    </span>
    <select class="goto-dropdown" placeholder="Page Size" [(ngModel)]="prodcastService.PAGE_SIZE" (change)="prodcastService.pageSizeChange()">
      <option *ngFor="let a of [10,20,50,100,200,500]">{{a}}</option>
    </select>
  </div>
  <div class="dropdown">
    <span>
      Goto Page
    </span>
    <select class="goto-dropdown" placeholder="Go To Page" [(ngModel)]="prodcastService.pageNumber" (change)="prodcastService.goToPage()">
      <option *ngFor="let a of prodcastService.gotopagelist" [value]="a">{{a+1}}</option>
    </select>
  </div>
  <div style="position: relative; top: 10px;">
    Of <strong>{{prodcastService.totalRows}}</strong>
  </div>
  
  <button type="button" (click)="prodcastService.paginate('first')" [disabled]="prodcastService.pageNumber == 0"><i class="fas fa-step-backward"></i></button>
  <button type="button" (click)="prodcastService.paginate('prev')" [disabled]="prodcastService.pageNumber == 0"><i class="fas fa-backward"></i></button>
  <button type="button" (click)="prodcastService.paginate('next')" [disabled]="prodcastService.pageNumber == prodcastService.gotopagelist[prodcastService.gotopagelist.length-1]"><i class="fas fa-forward"></i></button>
  <button type="button" (click)="prodcastService.paginate('last')" [disabled]="prodcastService.pageNumber == prodcastService.gotopagelist[prodcastService.gotopagelist.length-1]"><i class="fas fa-step-forward"></i></button>
</div>`
})
export class PaginationComponent implements OnInit {

  constructor(public prodcastService:ProdcastService) { }

  ngOnInit() {
  }

}
