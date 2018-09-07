/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CellsService } from './cells.service';

describe('Service: Cells', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellsService]
    });
  });

  it('should ...', inject([CellsService], (service: CellsService) => {
    expect(service).toBeTruthy();
  }));
});