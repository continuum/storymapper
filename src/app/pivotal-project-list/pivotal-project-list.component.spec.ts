import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotalProjectListComponent } from './pivotal-project-list.component';

describe('PivotalProjectListComponent', () => {
  let component: PivotalProjectListComponent;
  let fixture: ComponentFixture<PivotalProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PivotalProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotalProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
