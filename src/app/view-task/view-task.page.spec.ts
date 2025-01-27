import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTaskPage } from './view-task.page';

describe('ViewTaskPage', () => {
  let component: ViewTaskPage;
  let fixture: ComponentFixture<ViewTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
