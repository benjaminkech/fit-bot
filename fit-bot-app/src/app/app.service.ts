import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(private http: HttpClient) {}

    rootURL = '/api';

    getSettings(url: string) {
        return this.http.get(this.rootURL + '/' + url);
    }
}
