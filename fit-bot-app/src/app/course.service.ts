import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from './appconfig.service';

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
    settings: any;
    rootURL = '/api';

    constructor(private http: HttpClient, private appConfigService: AppConfigService) {
        this.settings = this.appConfigService.settings;
    }

    getAllCourses(): Observable<Course[]> {
        return this.http
            .get<Response>(this.rootURL + '/course')
            .pipe(map((res) => res.courses.filter((c) => c.enrolment === false)));
    }
}
