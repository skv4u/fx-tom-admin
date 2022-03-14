import { Component, OnInit } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-delete-podcast-list',
  templateUrl: './delete-podcast-list.component.html',
  styleUrls: ['./delete-podcast-list.component.scss']
})

export class DeletePodcastListComponent implements OnInit {
  showStatus:boolean=false;
  deleteList:any=[];
  deleteList1:any=[];
  isProgressing:boolean=false;

  constructor(public prodcastService:ProdcastService,public webService:WebService) { }

  ngOnInit() {
    this.getDeletedList();
  }
  getDeletedList(){
    this.isProgressing=true;
      this.webService.commonMethod('podcast/deletedlist/admin','' , 'GET').subscribe(
        (data) => {
          this.isProgressing=false;
          this.deleteList=data.Response;
          this.deleteList1=data.Response;

        })
  }
  searchList(data:any) {
    let temp = this.deleteList1.filter(x => JSON.stringify(x).toLowerCase().includes(data.toLowerCase()));
    this.deleteList = temp;
  }
  revokeSelectedPodcast(a){
    this.isProgressing=true;
    let req={
      "podcast_id":a.id ,
      }   
      this.webService.commonMethod('podcast/revoke/admin',req , 'POST').subscribe(
        (data) => {
          this.isProgressing=false;
          this.getDeletedList();
        })
  }
}
