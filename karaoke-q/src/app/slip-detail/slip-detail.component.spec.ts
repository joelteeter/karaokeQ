import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipDetailComponent } from './slip-detail.component';

describe('SlipDetailComponent', () => {
  let component: SlipDetailComponent;
  let fixture: ComponentFixture<SlipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlipDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
