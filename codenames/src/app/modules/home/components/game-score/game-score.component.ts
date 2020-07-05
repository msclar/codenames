import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardType } from 'src/app/shared/models/word.model';
import { Game } from 'src/app/shared/models/game.model';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-game-score',
  templateUrl: './game-score.component.html',
  styleUrls: ['./game-score.component.scss']
})
export class GameScoreComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  public game: Game = null;

  constructor(
    private gameStore: GamesStore
  ) { }

  ngOnInit() {
    this.gameStore.store$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(store => this.game = store.data);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private found(type: CardType): number {
    return this.game.words
      .filter(w =>
        w.type === type
        && w.selected
      ).length;
  }

  private total(type: CardType): number {
    return this.game.words
      .filter(w => w.type === type)
      .length;
  }

  get blueFound(): number {
    return this.found(CardType.BLUE);
  }

  get redFound(): number {
    return this.found(CardType.RED);
  }

  get blueCount(): number {
    return this.total(CardType.BLUE);
  }

  get redCount(): number {
    return this.total(CardType.RED);
  }

  get bluePlays(): boolean {
    return this.game.bluePlays;
  }

  textToDisplay() {
    const player = this.bluePlays ? 'blue' : 'red';
    let text = '';
    if (this.game && this.game.gameHasStarted && !this.game.codemasterHasToPlay) {
      text += player + ' codemaster gave clue ';
      text += this.game.currentWordHint + ' ' + this.game.currentNumberHint;
      text += ' to their team ---- ';
      text += this.game.clickedOnCurrentTurn;
    } else {
      text += player + ' codemaster\'s turn';
    }
    return text;
  }
}
