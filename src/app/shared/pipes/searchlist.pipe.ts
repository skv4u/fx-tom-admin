import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchlist'
})
export class SearchlistPipe implements PipeTransform {

  transform(value: any, args?: any,): any {
    if(args && args.length && value.length){
      return value.filter(x => x.name.toLowerCase().includes(args.toLowerCase()) || x.mobile.toLowerCase().includes(args.toLowerCase()))
        //JSON.stringify(x).toLowerCase().includes(args.toLowerCase()))
    }
    return value;
  }

}