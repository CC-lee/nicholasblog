/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClassEditService } from './class-edit.service';

describe('Service: ClassEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassEditService]
    });
  });

  it('should ...', inject([ClassEditService], (service: ClassEditService) => {
    expect(service).toBeTruthy();
  }));
});