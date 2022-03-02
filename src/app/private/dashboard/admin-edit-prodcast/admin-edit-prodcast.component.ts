import { Component, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-admin-edit-prodcast',
  templateUrl: './admin-edit-prodcast.component.html',
  styleUrls: ['./admin-edit-prodcast.component.scss']
})
export class AdminEditProdcastComponent implements OnInit {
  @Output() back = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
