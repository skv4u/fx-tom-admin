import { Component, OnInit } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-delete-podcast-list',
  templateUrl: './delete-podcast-list.component.html',
  styleUrls: ['./delete-podcast-list.component.scss']
})

export class DeletePodcastListComponent implements OnInit {
  showStatus: boolean = false;
  showcatDropDown: boolean = false;
  isProgressing: boolean = false;
  showStatusDropDown: boolean = false;
  IsView: boolean = false;
  currentIndex: number = 0;
  noteList: any = [];
  constructor(public prodcastService: ProdcastService, public webService: WebService, public toast: ToastService) { }

  ngOnInit() {
    this.prodcastService.getDeletedList();
  }
  // getDeletedList() {
  //   this.isProgressing = true;
  //   this.webService.commonMethod('podcast/deletedlist/admin', '', 'GET').subscribe(
  //     (data) => {
  //       this.isProgressing = false;
  //       this.prodcastService.deleteList = data.Response;
  //       this.prodcastService.deleteList1 = data.Response;

  //     })
  // }
  searchList(data: any) {
    let temp = this.prodcastService.deleteList1.filter(x => JSON.stringify(x).toLowerCase().includes(data.toLowerCase()));
    this.prodcastService.deleteList = temp;
  }
  revokeSelectedPodcast(a) {
    this.prodcastService.showPopUp.Revoke = true;
    this.prodcastService.selectedData = a;
  }
  // selectedrevoke() {
  //   this.isProgressing = true;
  //   let req = {
  //     "podcast_id": this.prodcastService.selectedData.id,
  //   }
  //   this.webService.commonMethod('podcast/revoke/admin', req, 'POST').subscribe(
  //     (data) => {
  //       this.isProgressing = false;
  //       if (data.Status == "Success" && data.Response == true) {
  //         this.toast.success('Revoked Sucessfully');
  //         this.getDeletedList();
  //       }
  //     })
  // }
  backtodashboard() {
    this.prodcastService.loader = false;
    // this.router.navigateByUrl('/dashboard');
    this.IsView = false;
  }
  getProdNoteList() {
    this.prodcastService.loader = true;
    let req = {
      "podcast_id": this.prodcastService.deleteList[this.currentIndex].id
    }
    this.webService.commonMethod('podcast/note/list ', req, 'POST').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        this.noteList = data.Response;
      })
  }
}
