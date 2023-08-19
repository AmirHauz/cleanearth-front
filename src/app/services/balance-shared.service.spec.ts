import { TestBed } from '@angular/core/testing';

import { BalanceSharedService } from './balance-shared.service';

describe('BalanceSharedService', () => {
  let service: BalanceSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
