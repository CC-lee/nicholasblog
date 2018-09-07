/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShopManageService } from './shop-manage.service';

describe('Service: ShopManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopManageService]
    });
  });

  it('should ...', inject([ShopManageService], (service: ShopManageService) => {
    expect(service).toBeTruthy();
  }));
});