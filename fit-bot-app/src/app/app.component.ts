import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Course, CourseService, Trigger } from './course.service';
import { IosInstallComponent } from './ios-install/ios-install.component';
import { NotificationService } from './notification.service';
import { Request, RequestService } from './request.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'FIT BOT';
    durationInSeconds = 5;
    filteredOptions$: Observable<Course[]> | undefined;
    form: FormGroup = new FormGroup({});
    toolbar: boolean = true;
    logo: string = '../assets/logo.svg';
    minDate: Date;
    maxDate: Date;

    constructor(
        private courseService: CourseService,
        private datePipe: DatePipe,
        private _snackBar: MatSnackBar,
        private notificationService: NotificationService,
        private requestService: RequestService
    ) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.maxDate.setDate(this.minDate.getDate() + 20);
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            course: new FormControl('', Validators.required),
            phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),
        });

        this.requestService.getAll().then((requests: Array<Request>) => {
            this.phone?.setValue(requests[requests.length - 1].number);
        });

        if (this.date !== null) {
            this.filteredOptions$ = combineLatest([
                this.date.valueChanges.pipe(startWith(this.date.value)),
                this.courseService.getAllCourses(),
            ]).pipe(
                map(([date, courses]) => {
                    this.course?.reset();
                    return courses.filter(course => course.date === this._transformDate(date));
                })
            );
        }

        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        };

        const isInStandaloneMode = () =>
            'standalone' in (window as any).navigator && (window as any).navigator.standalone;

        if (isIos() && !isInStandaloneMode()) {
            this._snackBar.openFromComponent(IosInstallComponent, {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
        } else if (isIos() && isInStandaloneMode()) {
            this.toolbar = false;
            this.logo = '../assets/logo-primary.svg';
        }
    }

    get date(): AbstractControl | null {
        return this.form.get('date');
    }
    get course(): AbstractControl | null {
        return this.form.get('course');
    }
    get phone(): AbstractControl | null {
        return this.form.get('phone');
    }

    private _transformDate(value: string): string | null {
        return this.datePipe.transform(value, 'YYYY-MM-dd');
    }

    onSubmit(): void {
        const date = this._transformDate(this.form.value.date);
        const to = '+41' + this.form.value.phone;
        const id = this.form.value.course.id;
        const body = { id, date, to } as Trigger;

        this._sendNotification(body);

        const request = {
            number: this.form.value.phone,
            date: this.form.value.date,
            course: this.form.value.course,
        } as Request;
        this.requestService.add(request);
    }

    openSnackBar(message: string, action: string | undefined, config: MatSnackBarConfig): void {
        this._snackBar.open(message, action, config);
    }

    private _sendNotification(body: Trigger) {
        const action = undefined;
        const config: MatSnackBarConfig = {
            duration: this.durationInSeconds * 1000,
        };

        this.notificationService.postTrigger(body).subscribe(
            data => {
                const message = 'You will get a confirmation in a sec. 🎉';
                this.openSnackBar(message, action, config);
            },
            error => {
                const message = 'Ups there was an error.';
                config.panelClass = ['snackbar-error'];
                this.openSnackBar(message, action, config);
            }
        );
    }
}
