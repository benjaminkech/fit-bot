import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Course, CourseService, Trigger } from './course.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'migros-fitness-waitlist-rwc';
    durationInSeconds = 5;
    options: Course[] = [];
    destroy$: Subject<boolean> = new Subject<boolean>();
    filteredOptions: Observable<Course[]> | undefined;
    form: FormGroup = new FormGroup({});

    constructor(
        private courseService: CourseService,
        private datePipe: DatePipe,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            date: new FormControl('', Validators.required),
            course: new FormControl('', Validators.required),
            phone: new FormControl('', [
                Validators.required,
                Validators.pattern('^[0-9]{9}$'),
            ]),
        });

        this.courseService.getAllCourses().subscribe((data: Course[]) => {
            this.options = data;
        });

        this.filteredOptions = this.course?.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterTitle(value))
        );

        this.filteredOptions = this.date?.valueChanges.pipe(
            startWith(''),
            map((value) => {
                this.course?.reset();
                return this._filterDate(value);
            })
        );
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

    ngOnDestroy(): void {
        this.destroy$.next(true);
        // Unsubscribe from the subject
        this.destroy$.unsubscribe();
    }

    private _filterTitle(value: string): Course[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(
            (c) => c.title.toLowerCase().indexOf(filterValue) === 0
        );
    }

    private _filterDate(value: string): Course[] {
        const filterValue = this.datePipe.transform(value, 'YYYY-MM-dd');
        return this.options.filter((c) => c.date === filterValue);
    }

    onSubmit(): void {
        const date = this.datePipe.transform(
            this.form.value.date,
            'YYYY-MM-dd'
        );
        const to = '+41' + this.form.value.phone;
        const id = this.form.value.course.id;

        const body = { id, date, to } as Trigger;

        const action = undefined;
        const config: MatSnackBarConfig = {
            duration: 3000,
        };

        this.courseService.postTrigger(body).subscribe(
            (data) => {
                const message = 'You will get a confirmation in a sec. 🎉';
                this.openSnackBar(message, action, config);
            },
            (error) => {
                const message = 'Ups there was an error.';
                config.panelClass = ['snackbar-error'];
                this.openSnackBar(message, action, config);
            }
        );
    }

    getOptionText(option: Course): string {
        if (!option) {
            return '';
        }
        return option.title;
    }

    openSnackBar(
        message: string,
        action: string | undefined,
        config: MatSnackBarConfig
    ): void {

      
        this.snackBar.open(message, action, config)
    }
}
