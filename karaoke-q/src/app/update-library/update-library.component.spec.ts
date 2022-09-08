import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLibraryComponent } from './update-library.component';

describe('UpdateLibraryComponent', () => {
  let component: UpdateLibraryComponent;
  let fixture: ComponentFixture<UpdateLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
