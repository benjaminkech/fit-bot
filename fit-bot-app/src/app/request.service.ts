import { Injectable } from '@angular/core';
import { DexieService } from './chore/dexie.service';
import { Course } from './course.service';

export interface Request {
    number: string;
    course?: Course;
    date?: Date;
}

export interface Phone {}

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
