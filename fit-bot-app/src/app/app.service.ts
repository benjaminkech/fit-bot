import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    rootURL = '/api';

    constructor(private http: HttpClient) {}

    getSettings(url: string) {
        return this.http.get(this.rootURL + '/' + url);
    }
}
