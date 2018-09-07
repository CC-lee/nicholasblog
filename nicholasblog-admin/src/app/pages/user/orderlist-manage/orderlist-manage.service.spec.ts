/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderlistManageService } from './orderlist-manage.service';

describe('Service: OrderlistManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderlistManageService]
    });
  });

  it('should ...', inject([OrderlistManageService], (service: OrderlistManageService) => {
    expect(service).toBeTruthy();
  }));
});