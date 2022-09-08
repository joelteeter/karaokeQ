import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipsComponent } from './slips.component';

describe('SlipsComponent', () => {
  let component: SlipsComponent;
  let fixture: ComponentFixture<SlipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
