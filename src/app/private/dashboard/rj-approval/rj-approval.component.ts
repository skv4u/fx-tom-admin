import { Component, OnInit } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-rj-approval',
  templateUrl: './rj-approval.component.html',
  styleUrls: ['./rj-approval.component.scss']
})
export class RjApprovalComponent implements OnInit {
  showStatus:boolean=false;
  RJList:any=[];
  currentIndex:number=0;
  constructor(public prodcastService:ProdcastService,public webService:WebService,public toast:ToastService) { }

  ngOnInit() {
    this.getRjApprovalsList();
  }
  getRjApprovalsList(){
    this.prodcastService.loader=true;
    this.webService.commonMethod('user/list/admin','' , 'GET').subscribe(
      (data) => {
        this.prodcastService.loader=false;
        this.RJList = data.Response;
        for(let a of this.RJList){
          a.StatusCode=a.approval_status.toLowerCase();
          a.ShowStatus = false;
        }
      })
  }
  getApproveStatus(i,status){
    this.prodcastService.loader=true;
    let req={
    "user_id":this.RJList[i].id ,
    "approval_status": status,
    "created_by":"Admin"
    }   
    this.webService.commonMethod('user/approve/admin',req , 'PUT').subscribe(
      (data) => {
        this.prodcastService.loader=false;
       if(data.Status == 'Success' && data.Response){
        this.RJList[i].approval_status = status;
        this.RJList[i].StatusCode = status.toLowerCase();
         this.toast.success('Status Updated Sucessfully');
         
       }
       else{
         this.toast.error('invalid data')
       }
      },
    )
  }
}
