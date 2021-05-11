import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarRef } from '@angular/material/snack-bar';

import { IosInstallComponent } from './ios-install.component';

describe('IosInstallComponent', () => {
    let component: IosInstallComponent;
    let fixture: ComponentFixture<IosInstallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IosInstallComponent],
            providers: [MatSnackBarRef],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IosInstallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
