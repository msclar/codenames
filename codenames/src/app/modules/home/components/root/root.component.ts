import { Component, OnInit, OnDestroy } from '@angular/core';
import { DictionaryStore } from 'src/app/core/services/store/dictionary.store';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Game } from 'src/app/shared/models/game.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();
  lastGame: Game = null;

  constructor(
    private dictionaryStore: DictionaryStore,
    private gameStore: GamesStore
  ) { }

  ngOnInit() {
    this.dictionaryStore.fetchData(); // ensure dictionary is fetched
    this.gameStore
      .store$
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(store => {
        if (!store.isFetching && !store.error) {
          this.lastGame = store.data;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
