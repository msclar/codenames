import {CardType, Word} from './word.model';
import { HttpClient } from '@angular/common/http';


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
    currentWordHint = '';
    currentNumberHint = 0;
    clickedOnCurrentTurn = 0;

    refresh(gameid, lang) {
        this.http.get<any>('/codenamesserver/get?lang=' + lang + "&gameid=" + gameid).subscribe(data => {
            this.updateFromState(data.state);
            setTimeout(() => {this.refresh(gameid, lang);}, 250);
        });
    }

    changeActiveTeam() {
      this.codemasterHasToPlay = true;
      this.bluePlays = !this.bluePlays;
      this.clickedOnCurrentTurn = 0;
      this.currentWordHint = '';
      this.currentNumberHint = 0;
    }

    endTurn() {
        const prev = this.getstate();
        this.changeActiveTeam();
        this.dump(prev);
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
      this.gameHasStarted = obj['gameHasStarted']

      //const words = [];
      for (let i = 0; i < obj['words'].length; i++) {
        //words.push(new Word(obj['words'][i]['word'], obj['words'][i]['type'], obj['words'][i]['selected']));
        this.words[i].selected = obj['words'][i]['selected'];
      }
      //this.words = words;
    }

    getstate() { // La mas o menos la inversa de updateFromState
        var ret = {};
        ret['bluePlays'] = this.bluePlays;
        ret['codemasterHasToPlay'] = this.codemasterHasToPlay;
        ret['currentWordHint'] = this.currentWordHint;
        ret['currentNumberHint'] = this.currentNumberHint;
        ret['clickedOnCurrentTurn'] = this.clickedOnCurrentTurn;
        ret['gameHasStarted'] = this.gameHasStarted;
        
        const newWords = [];
        for (let i = 0; i < this.words.length; i++) {
            newWords.push(new Word(this.words[i]['word'], this.words[i]['type'], this.words[i]['selected']));
        }
        ret['words'] = newWords; // Supongo que no hace falta deep copy?
        
        ret['initialstate'] = false;
        return ret;
    }

    updateClickedClue(word: Word) {
      const prev = this.getstate()
      const clicked = word.click(this.codemasterScreen, this.codemasterHasToPlay);

      if (clicked) {
        this.clickedOnCurrentTurn += 1;
        if (!(word.cardType() === CardType.BLUE && this.bluePlays) &&
            !(word.cardType() === CardType.RED && !this.bluePlays)) {
          this.changeActiveTeam();
        }

        if (this.currentNumberHint > 0 && this.clickedOnCurrentTurn === this.currentNumberHint + 1) {
          this.changeActiveTeam();
        }
        this.dump(prev);
      }
    }

    codemasterGivesClue(): void {
      const prev = this.getstate();
      prev['currentWordHint'] = '';
      prev['currentNumberHint'] = 0;
      console.log(prev);
      // currentWordHint and currentNumberHint are updated directly in the form
      this.codemasterHasToPlay = false;
      this.gameHasStarted = true;
      this.dump(prev);
    }

    dump(prev) {
      const obj = {
         table: []
      };
      obj.table.push({'words': this.words,
                      'bluePlays': this.bluePlays,
                      'codemasterHasToPlay': this.codemasterHasToPlay,
                      'currentWordHint': this.currentWordHint,
                      'currentNumberHint': this.currentNumberHint,
                      'clickedOnCurrentTurn': this.clickedOnCurrentTurn});

      const json = this.getstate(); //JSON.stringify(obj);
      this.http.post<any>('/codenamesserver/update', { lang: this.language , gameid : this.seed, prevstate : prev, state : json }).subscribe(data => {});
      console.log(json);
    }
}
