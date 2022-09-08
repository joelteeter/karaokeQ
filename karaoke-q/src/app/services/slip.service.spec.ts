import { TestBed } from '@angular/core/testing';

import { SlipService } from './slip.service';

describe('SlipService', () => {
  let service: SlipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
