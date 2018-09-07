/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminMessageCreateService } from './admin-message-create.service';

describe('Service: AdminMessageCreate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminMessageCreateService]
    });
  });

  it('should ...', inject([AdminMessageCreateService], (service: AdminMessageCreateService) => {
    expect(service).toBeTruthy();
  }));
});