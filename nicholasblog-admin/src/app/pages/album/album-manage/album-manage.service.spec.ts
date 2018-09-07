/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlbumManageService } from './album-manage.service';

describe('Service: AlbumManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlbumManageService]
    });
  });

  it('should ...', inject([AlbumManageService], (service: AlbumManageService) => {
    expect(service).toBeTruthy();
  }));
});