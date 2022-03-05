import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-edit-prodcast',
  templateUrl: './edit-prodcast.component.html',
  styleUrls: ['./edit-prodcast.component.scss']
})
export class EditProdcastComponent implements OnInit {
  @Output() back = new EventEmitter();
  EditData:any={};
  constructor(public webservice:WebService) { }

  ngOnInit() {
  }

}
