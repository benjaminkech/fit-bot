import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'app-ios-install',
    templateUrl: './ios-install.component.html',
    styleUrls: ['./ios-install.component.scss'],
})
export class IosInstallComponent {
    constructor(private _snackBarRef: MatSnackBarRef<IosInstallComponent>) {}

    dismiss(): void {
        this._snackBarRef.dismiss();
    }
}
