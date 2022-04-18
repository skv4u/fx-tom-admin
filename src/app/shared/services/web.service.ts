import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ConfigurationMicroService } from './configuration-micro.service';
@Injectable()
export class WebService {
  APIUrl: string = "";
  APIToken: any = "";
  constructor(private http: HttpClient, public configurationService: ConfigurationMicroService) {
    this.APIUrl = this.configurationService.getUrl();
  }

  commonMethod(url: string, data: any, method?: string): any {
    method = method ? method : 'POST';
    // url_type = url_type ? url_type : 'DEV';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('adminttptoken')
    })
    let endPoint = this.APIUrl + "/" + url;
    if (method == 'POST')
      return this.http.post(endPoint, data, { headers });
    else if (method == 'GET')
      return this.http.get(endPoint, { headers });
    else if (method == 'PUT')
      return this.http.put(endPoint, data, { headers });
    else if (method == 'DELETE') {
      const options = {
        headers: headers,
        body: data
      };
      return this.http.delete(endPoint, options);
    }
  }
  UploadDocument(url: string, data: any) {
    // let headers = {
    //   headers: new HttpHeaders({
    //     'enctype': 'multipart/form-data'
    //   })
    // };
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('adminttptoken')
    });
    return this.http.post(this.APIUrl + '/' + url, data, {
      headers,
      reportProgress: true,
      observe: 'events'
    });

  }
  UploadFile(url, formData) {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('adminttptoken')
    });
    this.http.post(this.APIUrl + '/' + url, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe(resp => {
      if (resp.type === HttpEventType.Response) {
        console.log('Upload complete');
      }
      if (resp.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * resp.loaded / resp.total);
        console.log('Progress ' + percentDone + '%');
      }
    });
  }

  validImageList():string[] {
    return [
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]
  }
  validAudioList():string[] {
    return [
      'audio/mp3'
    ]
  }
}
