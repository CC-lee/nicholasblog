/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderlistEditService } from './orderlist-edit.service';

describe('Service: OrderlistEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderlistEditService]
    });
  });

  it('should ...', inject([OrderlistEditService], (service: OrderlistEditService) => {
    expect(service).toBeTruthy();
  }));
});