import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { StoreService } from './stores';
import { CacheExpiry } from '../../util/cache-expiry';
import {DictionaryService, LanguageEntry} from '../asset/dictionary.service';

@Injectable({ providedIn: 'root' })
export class DictionaryStore extends StoreService<LanguageEntry[]> {
    private cacheExpiry = new CacheExpiry();

    constructor(private restService: DictionaryService) {
        super();
    }

    // get the cached data
    public fetchData(): void {
        if (!this.cacheExpiry.isExpired) {
            return;
        }
        this.setStateFetching();
        this.restService
            .getAll()
            .pipe(
                super.catchErrorAndReset(),
                tap((next: LanguageEntry[]) => {
                    this.store$.next({
                        ...this.store$.value,
                        data: next,
                        error: null,
                        isFetching: false
                    });
                }),
                tap(() => this.cacheExpiry.updated())
            ).subscribe();
    }

    // Retrieve the data uncached
    public refresh(): void {
        this.cacheExpiry.refresh();
        this.fetchData();
    }
}

