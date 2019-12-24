import { Component, OnInit, OnDestroy } from '@angular/core';
import { DictionaryStore } from 'src/app/core/services/store/dictionary.store';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Game } from 'src/app/shared/models/game.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();
  lastGame: Game = null;

  constructor(
    private dictionaryStore: DictionaryStore,
    private gameStore: GamesStore,
    private router: Router,
    private window: Window,
  ) { }

  ngOnInit() {
    if (environment.enableAnalytics) {
      const ga = this.window['ga'];
      console.log(ga);
      if (ga) {
        ga('create', 'UA-154993310-1', 'auto');
        // subscribe to router events and send page views to Google Analytics
        this.router.events
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(event => {
            if (!(event instanceof NavigationEnd)) {
              return;
            }
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          });
      }
    }

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
