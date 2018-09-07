/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemCreateService } from './item-create.service';

describe('Service: ItemCreate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemCreateService]
    });
  });

  it('should ...', inject([ItemCreateService], (service: ItemCreateService) => {
    expect(service).toBeTruthy();
  }));
});