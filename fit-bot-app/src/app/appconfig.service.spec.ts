import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppConfigService } from './appconfig.service';

describe('AppconfigService', () => {
    let service: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(AppConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
