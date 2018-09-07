/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemEditService } from './item-edit.service';

describe('Service: ItemEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemEditService]
    });
  });

  it('should ...', inject([ItemEditService], (service: ItemEditService) => {
    expect(service).toBeTruthy();
  }));
});