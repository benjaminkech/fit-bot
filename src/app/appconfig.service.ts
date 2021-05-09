import { Injectable } from '@angular/core';
import { CourseService } from './course.service';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService extends CourseService {
    private envUrl = 'settings';
    private configSettings: any = null;

    get settings() {
        return this.configSettings;
    }

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getSettings(this.envUrl).subscribe((response: any) => {
                console.log('response from the server:::', response);
                this.configSettings = response;
                resolve(true);
            });
        });
    }
}
