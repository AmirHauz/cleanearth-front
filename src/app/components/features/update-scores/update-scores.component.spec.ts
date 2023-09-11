import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScoresComponent } from './update-scores.component';

describe('UpdateScoresComponent', () => {
  let component: UpdateScoresComponent;
  let fixture: ComponentFixture<UpdateScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateScoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
