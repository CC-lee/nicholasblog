/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClassManageService } from './class-manage.service';

describe('Service: ClassManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassManageService]
    });
  });

  it('should ...', inject([ClassManageService], (service: ClassManageService) => {
    expect(service).toBeTruthy();
  }));
});