import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceExecutionComponent } from './trace-execution.component';

describe('TraceExecutionComponent', () => {
  let component: TraceExecutionComponent;
  let fixture: ComponentFixture<TraceExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
