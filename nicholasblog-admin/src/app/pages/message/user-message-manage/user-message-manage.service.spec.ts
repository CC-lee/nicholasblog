/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserMessageManageService } from './user-message-manage.service';

describe('Service: UserMessageManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserMessageManageService]
    });
  });

  it('should ...', inject([UserMessageManageService], (service: UserMessageManageService) => {
    expect(service).toBeTruthy();
  }));
});