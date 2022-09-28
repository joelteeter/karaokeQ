import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSessionsComponent } from './manage-sessions.component';

describe('ManageSessionsComponent', () => {
  let component: ManageSessionsComponent;
  let fixture: ComponentFixture<ManageSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
