import { Component, OnInit } from '@angular/core';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { Word, CardType } from 'src/app/shared/models/word.model';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  private _words: string[];
  chosenWords: Word[];
  private _wordsPerColor: Word[][];
  gameid = '';
  isCodeMaster = false;
  isGameStarted = false;
  isDeath = false;
  private _first: CardType;

  constructor(private dictionaryService: DictionaryService) { }

  ngOnInit() {
    this.chosenWords = [];
    this._wordsPerColor = [];
    window['Math'].seedrandom('Hello.');
    for (let i = 0; i < 25; i++) {
      this.chosenWords.push(new Word());
    }
    this.dictionaryService.getAll().subscribe(data => {
      this._words = data;
    });
  }

  get bluesLeft(): Word[] {
    return this._wordsPerColor[CardType.BLUE];
  }
  get redsLeft(): Word[] {
    return this._wordsPerColor[CardType.RED];
  }
  get goesFirst(): string {
    return CardType[this._first].toLowerCase();
  }

  nextNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }

  canStartGame(): boolean {
    return this._words
      && this._words.length >= 25
      && this.gameid
      && this.gameid.length > 0;
  }

  enter(asCodeMaster: boolean): void {
    window['Math'].seedrandom(this.gameid);
    this._first = (this.nextNumber(2) === 0 ? CardType.BLUE : CardType.RED);
    this.distributeColors();
    this.distributeWords();
    this.isCodeMaster = asCodeMaster;
    this.showWordsForCodeMasterOnly();
    this.isGameStarted = true;
  }

  toggle(word: Word): void {
    if (this._wordsPerColor[word.type]) {
      this._wordsPerColor[word.type] = this._wordsPerColor[word.type].filter(w => w !== word);
    }
    if (word.type === CardType.DEATH) {
      this.isDeath = !this.isDeath;
    }
    word.toggle();
  }

  private distributeColors(): void {
    // 7 BLUE
    for (let i = 0; i < 7; i++) {
      this.chosenWords[i].type = CardType.BLUE;
    }
    // 1 RANDOM BLUE OR RED
    this.chosenWords[7].type = this._first;
    // 7 RED
    for (let i = 8; i < 15; i++) {
      this.chosenWords[i].type = CardType.RED;
    }
    // 1 BLACK
    this.chosenWords[15].type = CardType.DEATH;
    // 9 NEUTRAL
    for (let i = 16; i < 25; i++) {
      this.chosenWords[i].type = CardType.NEUTRAL;
    }
    this.addWordsToScore();
    this.shuffleChosenWords();
  }
  private addWordsToScore(): void {
    for (let i = 0; i < 25; i++) {
      if (!this._wordsPerColor[this.chosenWords[i].type]) {
        this._wordsPerColor[this.chosenWords[i].type] = [];
      }
      this._wordsPerColor[this.chosenWords[i].type].push(this.chosenWords[i]);
    }
  }

  private distributeWords(): void {
    this.shuffleWords();
    for (let i = 0; i < 25; i++) {
      this.chosenWords[i].word = this._words[i];
    }
  }

  private showWordsForCodeMasterOnly(): void {
    for (let i = 0; i < 25; i++) {
      this.chosenWords[i].show = this.isCodeMaster;
    }
  }

  private shuffleWords(): void {
    for (let i = 0; i < 25; i++) {
      const pick = i + this.nextNumber(this._words.length - i);
      // And swap it with the current element.
      const tmp = this._words[i];
      this._words[i] = this._words[pick];
      this._words[pick] = tmp;
    }
  }
  private shuffleChosenWords(): void {
    for (let i = 0; i < this.chosenWords.length; i++) {
      const pick = i + this.nextNumber(this.chosenWords.length - i);
      // And swap it with the current element.
      const tmp = this.chosenWords[i];
      this.chosenWords[i] = this.chosenWords[pick];
      this.chosenWords[pick] = tmp;
    }
  }
}
