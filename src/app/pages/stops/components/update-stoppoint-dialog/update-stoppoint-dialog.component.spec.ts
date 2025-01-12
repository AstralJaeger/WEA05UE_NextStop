import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStoppointDialogComponent } from './update-stoppoint-dialog.component';

describe('UpdateStoppointDialogComponent', () => {
  let component: UpdateStoppointDialogComponent;
  let fixture: ComponentFixture<UpdateStoppointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStoppointDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStoppointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
