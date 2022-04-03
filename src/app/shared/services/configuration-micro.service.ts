import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationMicroService {
  PROTOCOL: string = window.location.host.includes("localhost") ? 'http:' : window.location.protocol;
 private URL:any={
  "DEV":this.PROTOCOL + "//ec2-35-173-233-212.compute-1.amazonaws.com/api",
  "QA":this.PROTOCOL + "//ec2-35-173-233-212.compute-1.amazonaws.com/api", 
  "PROD":this.PROTOCOL + "//ec2-35-173-233-212.compute-1.amazonaws.com/api"
  };
  constructor() { }

  getUrl(){
    return this.URL;
  }
  formatDate(date, format, seperator, isTime?: boolean) { //"Format:dd-mm-yy,mm-dd-yy,dd/mm/yy,dd:mm:yy" & Seperator - '-','/',',',':'
    if (date != "" && date != undefined) {

      if (typeof date == 'string' && date.includes("GMT+")) {
        date = date.split("GMT+")[0];
      }
      else if (typeof date == 'string' && date.includes("+")) {
        date = date.split("+")[0];
      }
      let d = new Date(date),
        mm = '' + (d.getMonth() + 1),
        mmm: any = d.getMonth(),
        dd = '' + d.getDate(),
        yy = d.getFullYear();
      let month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (mm.length < 2) mm = '0' + mm;
      if (dd.length < 2) dd = '0' + dd;
      let part = format.split(seperator);
      mmm = month_names[mmm];

      let sHour = d.getHours();
      let sMinute = this.padValue(d.getMinutes());
      let sAMPM = "AM";
      let iHourCheck = Number(sHour);
      if (iHourCheck >= 12) {
        sAMPM = "PM";
      }
      if (iHourCheck > 12) {
        sHour = iHourCheck - 12;
      }
      else if (iHourCheck === 0) {
        sHour = 12;
      }
      sHour = this.padValue(sHour);
      try {
        if (isTime) {
          return eval(part[0]) + seperator + eval(part[1]) + seperator + eval(part[2]) + ", " + sHour + ":" + sMinute + " " + sAMPM;
        }
        return eval(part[0]) + seperator + eval(part[1]) + seperator + eval(part[2]);
      }
      catch (e) {
        return '';
      }
    }
  }
  padValue(value): number {
    return (Number(value) < 10) ? "0" + value : value;
  }
}
