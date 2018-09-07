/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminMessageEditService } from './admin-message-edit.service';

describe('Service: AdminMessageEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminMessageEditService]
    });
  });

  it('should ...', inject([AdminMessageEditService], (service: AdminMessageEditService) => {
    expect(service).toBeTruthy();
  }));
});