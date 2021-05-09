import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigService } from '../appconfig.service';

export function init_app(appConfigService: AppConfigService) {
    return () => appConfigService.load();
}

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfigService], multi: true },
    ],
})
export class AppConfigModule {}
