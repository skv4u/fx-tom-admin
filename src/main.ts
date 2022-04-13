import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
if (!localStorage.getItem('tomtomtoken')) {
  let url = 'http://ec2-35-173-233-212.compute-1.amazonaws.com/api/token/generate';
  fetch(url).then(response => {
    // handle the response
    response.json().then(data => {
      localStorage.setItem('tomtomtoken', data.Response)
      platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err))
    })
  }).catch(error => {
    // handle the error
    console.log("token Error");
  });
} else {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
}

