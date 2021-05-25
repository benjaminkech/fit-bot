import { Injectable } from '@angular/core';
import { DexieService } from './chore/dexie.service';
import { Course } from './course.service';
import { StatusQueryResponse } from './notification.service';

export interface Request {
    phone: PhoneNumber;
    course: Course;
    status: StatusQueryResponse;
}

export interface PhoneNumber {
    countryCode: string;
    number: string;
}

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    table: Dexie.Table<Request, number>;

    constructor(private dexieService: DexieService) {
        this.table = this.dexieService.table('requests');
    }

    getAll() {
        return this.table.toArray();
    }

    add(data: Request) {
        return this.table.add(data);
    }

    remove(id: number) {
        return this.table.delete(id);
    }
}
