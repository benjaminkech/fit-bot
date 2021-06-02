import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Course, CourseService, Trigger } from './course.service';
import { IosInstallComponent } from './ios-install/ios-install.component';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'FIT BOT';
    durationInSeconds = 5;
    filteredOptions$: Observable<Course[]> | undefined;
    courses: Course[] = [];
    form: FormGroup = new FormGroup({});
    toolbar: boolean = true;
    logo: string = '../assets/logo.svg';
    minDate: Date;
    maxDate: Date;
    private unsubscripe$ = new Subject<void>();

    constructor(
        private courseService: CourseService,
        private datePipe: DatePipe,
        private _snackBar: MatSnackBar,
        private notificationService: NotificationService,
        private userService: UserService
    ) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.maxDate.setDate(this.minDate.getDate() + 20);
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            course: new FormControl('', Validators.required),
            userId: new FormControl('', Validators.required),
        });

        this.userService.getUserId().then((id: string | undefined) => {
            if (id) {
                this.userId?.setValue(id);
            }
        });

        if (this.userId !== null) {
            this.userId.valueChanges
                .pipe(
                    switchMap(id => {
                        return this.courseService.getAllCourses(id);
                    }),
                    takeUntil(this.unsubscripe$)
                )
                .subscribe(courses => (this.courses = courses));
        }

        if (this.date !== null) {
            this.date.valueChanges.pipe(takeUntil(this.unsubscripe$)).subscribe(date => this.course?.reset());
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

    ngOnDestroy(): void {
        this.unsubscripe$.next();
        this.unsubscripe$.complete();
    }

    get date(): AbstractControl | null {
        return this.form.get('date');
    }
    get course(): AbstractControl | null {
        return this.form.get('course');
    }
    get userId(): AbstractControl | null {
        return this.form.get('userId');
    }

    private _transformDate(value: string): string | null {
        return this.datePipe.transform(value, 'YYYY-MM-dd');
    }

    onSubmit(): void {
        const action = undefined;
        const config: MatSnackBarConfig = {
            duration: this.durationInSeconds * 1000,
        };

        const courseId = this.form.value.course.id;
        const userId = this.form.value.userId;

        const body = { courseId, userId } as Trigger;

        this.notificationService
            .getNotification(body)
            .pipe(takeUntil(this.unsubscripe$))
            .subscribe(
                status => {
                    const message = 'You will get a confirmation in a sec. 🎉';
                    this.openSnackBar(message, action, config);

                    this.userService.put(this.form.value.userId);
                },
                error => {
                    const message = 'Ups there was an error.';
                    config.panelClass = ['snackbar-error'];
                    this.openSnackBar(message, action, config);
                }
            );
    }

    openSnackBar(message: string, action: string | undefined, config: MatSnackBarConfig): void {
        this._snackBar.open(message, action, config);
    }

    getFilteredCourses(): Course[] {
        let courses: Course[] = [];
        courses = this.courses.filter(course => course.date === this._transformDate(this.date?.value));
        return courses;
    }
}
