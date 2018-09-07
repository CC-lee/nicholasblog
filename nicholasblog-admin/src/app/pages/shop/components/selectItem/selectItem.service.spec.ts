/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SelectItemService } from './selectItem.service';

describe('Service: SelectItem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectItemService]
    });
  });

  it('should ...', inject([SelectItemService], (service: SelectItemService) => {
    expect(service).toBeTruthy();
  }));
});