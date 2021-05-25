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
    phone: string;
}

@Injectable({
    providedIn: 'root',
})
export class CourseService {
    rootURL = '/api';
    timezone = '+02:00';

    constructor(private http: HttpClient) {}

    getAllCourses(): Observable<Course[]> {
        return this.http.get<Response>(this.rootURL + '/course').pipe(
            map(res =>
                res.courses.filter(c => {
                    const unixTimeZero = Date.parse(c.date + 'T' + c.timeStart + this.timezone);
                    return c.enrolment === false && unixTimeZero > Date.now();
                })
            )
        );
    }
}
