import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEvolutionComponent } from './add-evolution.component';

describe('AddEvolutionComponent', () => {
  let component: AddEvolutionComponent;
  let fixture: ComponentFixture<AddEvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEvolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
