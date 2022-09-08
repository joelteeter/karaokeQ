import { TestBed } from '@angular/core/testing';

import { UpdateLibraryService } from './update-library.service';

describe('UpdateLibraryService', () => {
  let service: UpdateLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
