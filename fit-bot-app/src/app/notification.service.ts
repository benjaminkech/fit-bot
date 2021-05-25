import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
export interface Input {
    id: string;
    phone: string;
}

export interface StatusQueryResponse {
    name: string;
    instanceId: string;
    runtimeStatus: string;
    input: Input;
    customStatus?: any;
    output?: any;
    createdTime: Date;
    lastUpdatedTime: Date;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    settings: any;

    constructor(private http: HttpClient, private appConfigService: AppConfigService) {
        this.settings = this.appConfigService.settings;
    }

    postTrigger(data: Trigger): Observable<TriggerResponse> {
        return this.http.post<TriggerResponse>(this.settings.triggerApi, data);
    }

    getStatusQuery(url: string): Observable<StatusQueryResponse> {
        return this.http.get<StatusQueryResponse>(url);
    }

    getNotification(data: Trigger): Observable<StatusQueryResponse> {
        return this.postTrigger(data).pipe(
            switchMap((response: TriggerResponse) =>
                this.getStatusQuery(response.statusQueryGetUri).pipe(
                    map((status: StatusQueryResponse) => {
                        return status;
                    })
                )
            )
        );
    }
}
