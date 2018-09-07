/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClassCreateService } from './class-create.service';

describe('Service: ClassCreate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassCreateService]
    });
  });

  it('should ...', inject([ClassCreateService], (service: ClassCreateService) => {
    expect(service).toBeTruthy();
  }));
});