import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-admin-edit-prodcast',
  templateUrl: './admin-edit-prodcast.component.html',
  styleUrls: ['./admin-edit-prodcast.component.scss']
})
export class AdminEditProdcastComponent implements OnInit {
  @Output() back = new EventEmitter();
  EditData: any = {};
  CategoryList: any = [];
  LanguageList: any = [{
    "id": "1",
    "name": "Telugu"
  },
  {
    "id": "2",
    "name": "Hindi"
  },
  {
    "id": "3",
    "name": "English"
  },
  {
    "id": "4",
    "name": "Kanada"
  }
  ];
  noteList:any=[];
  constructor(public webservice: WebService,public prodcastservice:ProdcastService) { }

  ngOnInit() {
    this.EditData = this.prodcastservice.editlist;
    this.getProdNoteList();
  }
  getProdNoteList() {
    let req={
      "podcast_id":this.EditData.id
    }
    this.webservice.commonMethod('podcast/note/list ', req, 'POST').subscribe(
      (data) => {
        this.noteList = data.Response;
      })
    }
}
