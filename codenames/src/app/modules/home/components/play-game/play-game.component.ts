import { Component, OnInit, OnDestroy } from '@angular/core';
import { Word, CardType } from 'src/app/shared/models/word.model';
import { Game } from 'src/app/shared/models/game.model';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss']
})
export class PlayGameComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  public game: Game = null;
  public error?: string = null;
  public isFetching = true;

  constructor(
    private gameStore: GamesStore,
    private router: Router
  ) { }

  ngOnInit() {
    this.gameStore.store$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(store => {
        if (store.data) {
          this.game = store.data;
        } else if (!store.isFetching && !store.error) {
          this.router.navigate(['/']);
        }
        this.isFetching = store.isFetching;
        this.error = store.error;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public get isDeath(): boolean {
    return this.game
      && this.game.words.some(w => w.type === CardType.DEATH && w.selected);
  }

  getClassFor(word: Word): string {
    let cs = 'word';
    if (this.game.codemasterScreen || word.selected) {
      cs += ' show ' + (this.game.codemasterScreen ? 'codemaster ' : '') + CardType[word.type].toLowerCase();
      if (this.game.codemasterScreen && word.selected) {
        cs += ' ignored';
      }
    }
    return cs;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  noSpacesAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode === 32);
  }

  isParsedIntInRange(currentNumberHint: string) {
    const number = parseInt(currentNumberHint, 10);
    return number >= 0 && number <= 25;
  }
}
