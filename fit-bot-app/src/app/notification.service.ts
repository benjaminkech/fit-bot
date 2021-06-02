import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './appconfig/appconfig.service';
import { Trigger } from './course.service';

export interface TriggerResponse {
    id: string;
    statusQueryGetUri: string;
    sendEventPostUri: string;
    terminatePostUri: string;
    purgeHistoryDeleteUri: string;
    restartPostUri: string;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    settings: any;

    constructor(private http: HttpClient, private appConfigService: AppConfigService) {
        this.settings = this.appConfigService.settings;
    }

    getNotification(data: Trigger): Observable<TriggerResponse> {
        return this.http.post<TriggerResponse>(this.settings.triggerApi, data);
    }
}
