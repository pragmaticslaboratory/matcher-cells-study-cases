import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTestsComponent } from './summary-tests.component';

describe('SummaryTestsComponent', () => {
  let component: SummaryTestsComponent;
  let fixture: ComponentFixture<SummaryTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
