/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BaPageTopService } from './baPageTop.service';

describe('Service: BaPageTop', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaPageTopService]
    });
  });

  it('should ...', inject([BaPageTopService], (service: BaPageTopService) => {
    expect(service).toBeTruthy();
  }));
});