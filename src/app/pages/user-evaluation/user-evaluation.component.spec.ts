import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEvaluationComponent } from './user-evaluation.component';

describe('UserEvaluationComponent', () => {
  let component: UserEvaluationComponent;
  let fixture: ComponentFixture<UserEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
