import { TestBed } from '@angular/core/testing';

import { EmpanadasService } from './empanadas.service';

describe('EmpanadasService', () => {
  let service: EmpanadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpanadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
