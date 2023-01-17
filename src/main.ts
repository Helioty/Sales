import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { routes } from './app/app.routing';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
console.log(environment.production ? 'Production' : 'Development');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      IonicModule.forRoot(),
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ]),
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch((err) => console.log(err));
