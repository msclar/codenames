import {CardType, Word} from './word.model';
import {HttpClient} from '@angular/common/http';


export class Game {
    constructor(
        private http: HttpClient,
        public readonly seed: string,
        public readonly language: string
    ) {
        this.refresh(seed, language);
    }
    words: Word[] = [];
    bluePlays = true;
    codemasterHasToPlay = true;
    codemasterScreen = false;
    gameHasStarted = false;
    gameHasEnded = false;
    currentWordHint = '';
    currentNumberHint = '';
    clickedOnCurrentTurn = 0;
    moveId = 0;

    refresh(gameid, lang) {
        this.http.get<any>('/codenamesserver/get?lang=' + lang + "&gameid=" + gameid).subscribe(data => {
            this.updateFromState(data.state);
            setTimeout(() => {this.refresh(gameid, lang);}, 250);
        });
    }

    private found(words: Word[], type: CardType): number {
      return words
        .filter(w =>
          w.type === type
          && w.selected
        ).length;
    }

    private total(words: Word[], type: CardType): number {
      return words
        .filter(w => w.type === type)
        .length;
    }

    changeActiveTeam(newstate) {
      newstate.codemasterHasToPlay = true;
      newstate.bluePlays = !newstate.bluePlays;
      newstate.clickedOnCurrentTurn = 0;
      newstate.currentWordHint = '';
      newstate.currentNumberHint = '';
      newstate.moveId += 1;
    }

    endTurn() {
        const newstate = this.getstate();
        this.changeActiveTeam(newstate);
        this.dump(this.getstate(), newstate);
    }

    updateFromState(obj) {
      if (obj['initialstate']) { return; }

      this.bluePlays = obj['bluePlays'];
      this.codemasterHasToPlay = obj['codemasterHasToPlay'];
      if (!this.codemasterHasToPlay) {
          this.currentWordHint = obj['currentWordHint'];
          this.currentNumberHint = obj['currentNumberHint'];
      }
      this.clickedOnCurrentTurn = obj['clickedOnCurrentTurn'];
      this.gameHasStarted = obj['gameHasStarted'];
      this.gameHasEnded = obj['gameHasEnded'];
      this.moveId = obj['moveId'];

      for (let i = 0; i < obj['words'].length; i++) {
        this.words[i].selected = obj['words'][i]['selected'];
      }
    }

    getstate() { // La mas o menos la inversa de updateFromState
        var ret = {};
        ret['bluePlays'] = this.bluePlays;
        ret['codemasterHasToPlay'] = this.codemasterHasToPlay;
        ret['currentWordHint'] = this.currentWordHint;
        ret['currentNumberHint'] = this.currentNumberHint;
        ret['clickedOnCurrentTurn'] = this.clickedOnCurrentTurn;
        ret['gameHasStarted'] = this.gameHasStarted;
        ret['gameHasEnded'] = this.gameHasEnded;
        ret['moveId'] = this.moveId;

        const newWords = [];
        for (let i = 0; i < this.words.length; i++) {
            newWords.push(new Word(this.words[i]['word'], this.words[i]['type'], this.words[i]['selected']));
        }
        ret['words'] = newWords; // Supongo que no hace falta deep copy?

        ret['initialstate'] = false;
        return ret;
    }

    updateClickedClue(word: Word) {
      const newstate = this.getstate();
      for (let i = 0; i < newstate['words'].length; i++) {
        if (newstate['words'][i].word === word.word) {
            word = newstate['words'][i];
            break;
        }
      }
      const clicked = word.click(this.codemasterScreen, this.codemasterHasToPlay, this.gameHasEnded);

      if (clicked) {
        newstate['clickedOnCurrentTurn'] += 1;
        if (word.cardType() === CardType.DEATH) {
          newstate['moveId'] += 1;
          newstate['gameHasEnded'] = true; // active player just lost
          this.dump(this.getstate(), newstate);
          return;
        }

        if (this.found(newstate['words'], CardType.BLUE) === this.total(newstate['words'], CardType.BLUE) ||
            this.found(newstate['words'], CardType.RED) === this.total(newstate['words'], CardType.RED)) {
          newstate['moveId'] += 1;
          newstate['gameHasEnded'] = true; // active player just won
        }

        const numberHint = parseInt(newstate['currentNumberHint'], 10);
        if (!(word.cardType() === CardType.BLUE && newstate['bluePlays']) &&
          !(word.cardType() === CardType.RED && !newstate['bluePlays'])) {
          this.changeActiveTeam(newstate);
        } else if (numberHint > 0 && newstate['clickedOnCurrentTurn'] === numberHint + 1) {
          this.changeActiveTeam(newstate);
        } else {
          newstate['moveId'] += 1;
        }

        this.dump(this.getstate(), newstate);
      }
    }

    codemasterGivesClue(): void {
      const newstate = this.getstate();
      const prev = this.getstate();
      prev['currentWordHint'] = '';
      prev['currentNumberHint'] = '';
      // currentWordHint and currentNumberHint are updated directly in the form
      newstate['codemasterHasToPlay'] = false;
      newstate['gameHasStarted'] = true;
      newstate['moveId'] += 1;
      this.dump(prev, newstate);
    }

    dump(prev, newstate) {
      this.http.post<any>('/codenamesserver/update', { lang: this.language, gameid : this.seed, prevstate : prev, state : newstate }).subscribe(data => {});
    }
}
