import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Weekday {
    id: number;
    text: string;
}

export interface Daytime {
    id: number;
    text: string;
}

export interface Center {
    id: number;
    text: string;
    shortText: string;
}

export interface Title {
    id: number;
    text: string;
}

export interface Filter {
    types: any[];
    topics: any[];
    weekdays: Weekday[];
    daytimes: Daytime[];
    centers: Center[];
    titles: Title[];
}

export interface Course {
    id: string;
    title: string;
    timeStart: string;
    timeEnd: string;
    date: string;
    daytime: number;
    weekday: number;
    types: any[];
    topics: any[];
    instructor: string;
    location: string;
    enrolment: boolean;
    booked: boolean;
    availablePlaces: number;
    maxPlaces: number;
    centerId: number;
    enrolmentId: string;
    titleId: number;
    marked: boolean;
    reservationDescription: string;
}

export interface Day {
    date: string;
    title: string;
}

export interface Response {
    filter: Filter;
    courses: Course[];
    days: Day[];
}

export interface Trigger {
    id: string;
    date: string;
    to: string;
}

@Injectable({
    providedIn: 'root',
})
export class CourseService {
    private REST_API =
        'https://prod-29.switzerlandnorth.logic.azure.com:443/workflows/3deb71284c48497fbc3a1765da1652fb/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0rk8rmHAgE5cgyZUz01pI-yAbb1soDb7rJ9xTvPs8t4';
    private TRIGGER_API =
        'https://prod-09.switzerlandnorth.logic.azure.com:443/workflows/517f96c449534eedb35e3cd5126fa9e8/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=STVYYosgiY3V_y33rDOzNmfE7YzUTdGHkL3VBo2WUeQ';

    constructor(private http: HttpClient) {}

    rootURL = '/api';

    getAllCourses(): Observable<Course[]> {
        return this.http
            .post<Response>(this.REST_API, { path: '/coursematrix/5/de' })
            .pipe(map((res) => res.courses.filter((c) => c.enrolment === false)));
    }

    postTrigger(data: Trigger): Observable<any> {
        return this.http.post<Trigger>(this.TRIGGER_API, data, {
            observe: 'response',
        });
    }

    getSettings(url: string) {
        return this.http.get(this.rootURL + '/' + url);
    }
}
