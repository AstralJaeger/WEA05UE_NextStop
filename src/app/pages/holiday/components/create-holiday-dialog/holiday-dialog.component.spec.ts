import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HolidayDialogComponent} from './holiday-dialog.component';

describe('CreateHolidayDialogComponent', () => {
  let component: HolidayDialogComponent;
  let fixture: ComponentFixture<HolidayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
