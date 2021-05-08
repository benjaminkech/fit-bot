import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { config, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Course, CourseService, Trigger } from './course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'migros-fitness-waitlist-rwc';
  durationInSeconds = 5;
  options: Course[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  filteredOptions!: Observable<Course[]>;
  form: FormGroup = new FormGroup({});

  constructor(
    private _courseService: CourseService, 
    private _datePipe: DatePipe, 
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    this.form = new FormGroup({
      date: new FormControl(''),
      course: new FormControl(''),
      phone: new FormControl(''),
    });

    this._courseService.getAllCourses().subscribe((data: Course []) => {
      console.log(data);
      this.options = data;
    })  
    
    this.filteredOptions = this.form.get('course')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTitle(value))
    );

    this.filteredOptions = this.form.get('date')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDate(value))
    )
  
  }

  get phone() { return this.form.get('phone'); }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  private _filterTitle(value: string): Course[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(c => c.title.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterDate(value: string): Course[] {
    const filterValue = this._datePipe.transform(value,'YYYY-MM-dd');
    return this.options.filter(c => c.date === filterValue);
  }

  onSubmit() {
   const date = this._datePipe.transform(this.form.value.date,'YYYY-MM-dd');
   const to = this.form.value.phone;
   const id = this.form.value.course.id;
   const body = { id, date } as Trigger;
   let status = null;
   this._courseService.postTrigger(body).subscribe(data => {
     status = data.status;
   })
   this.openSnackBar(status);
  }

  getOptionText(option: Course): string {
    if (!option) return '';
    console.log(option)
    return option.title + " " + option.timeStart;
  }

  openSnackBar(status: Number | null) {
    let message = "You will get a confirmation in a sec.";
    const action = undefined;
    const config: MatSnackBarConfig = { 
      duration: 3000,
      panelClass: ['snackbar-success']
    };
    if (status !== 202) {
      config.panelClass = ['snackbar-error']
      message = "There was an error";
    }
    this._snackBar.open(message, action, config);
  }
}
