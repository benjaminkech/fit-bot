import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trigger } from './course.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './appconfig/appconfig.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    settings: any;

    constructor(private http: HttpClient, private appConfigService: AppConfigService) {
        this.settings = this.appConfigService.settings;
    }

    postTrigger(data: Trigger): Observable<any> {
        return this.http.post<Trigger>(this.settings.triggerApi, data, {
            observe: 'response',
        });
    }
}
