import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoppointDialogComponent } from './create-stoppoint-dialog.component';

describe('CreateStoppointDialogComponent', () => {
  let component: CreateStoppointDialogComponent;
  let fixture: ComponentFixture<CreateStoppointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStoppointDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStoppointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
