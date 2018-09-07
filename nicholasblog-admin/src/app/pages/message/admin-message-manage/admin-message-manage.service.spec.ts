/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminMessageManageService } from './admin-message-manage.service';

describe('Service: AdminMessageManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminMessageManageService]
    });
  });

  it('should ...', inject([AdminMessageManageService], (service: AdminMessageManageService) => {
    expect(service).toBeTruthy();
  }));
});