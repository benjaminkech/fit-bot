import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService extends AppService {
    private envUrl = 'settings';
    private configSettings: any = null;

    get settings() {
        return this.configSettings;
    }

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getSettings(this.envUrl).subscribe((response: any) => {
                this.configSettings = response;
                resolve(true);
            });
        });
    }
}
