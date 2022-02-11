import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DexieService } from './chore/dexie.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    table: Dexie.Table<string, number>;

    constructor(private dexieService: DexieService) {
        this.table = this.dexieService.table('userId');
    }

    getUserId() {
        return this.table.get(0);
    }

    put(data: string) {
        this.table.put(data, 0);
    }
}
