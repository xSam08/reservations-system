// Angular imports
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Routes
import { routes } from './app.routes';

// Toastr for notifications
import { ToastrModule } from 'ngx-toastr';

export const appConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-left',
        toastClass: 'ngx-toastr',
        enableHtml: true,
        preventDuplicates: true
      })
    ),
    provideRouter(routes)
  ]
};
