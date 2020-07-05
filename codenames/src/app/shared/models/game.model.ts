import {CardType, Word} from './word.model';

export class Game {
    constructor(
        public readonly seed: string,
        public readonly language: string
    ) {
    }
    words: Word[] = [];
    bluePlays = true;
    codemasterHasToPlay = true;
    codemasterScreen = false;
    gameHasStarted = false;
    currentWordHint = '';
    currentNumberHint = 0;
    clickedOnCurrentTurn = 0;

    changeActiveTeam() {
      this.bluePlays = !this.bluePlays;
      this.clickedOnCurrentTurn = 0;
    }

    updateFromState(obj) {
      this.bluePlays = obj['bluePlays'];
      this.codemasterHasToPlay = obj['codemasterHasToPlay'];
      this.currentWordHint = obj['currentWordHint'];
      this.currentNumberHint = obj['currentNumberHint'];
      this.clickedOnCurrentTurn = obj['clickedOnCurrentTurn'];

      const words = [];
      for (let i = 0; i < obj['words'].length; i++) {
        words.push(new Word(obj['words'][i]['word'], obj['words'][i]['type'], obj['words'][i]['selected']));
      }
      this.words = words;
    }

    updateClickedClue(word: Word) {
      const clicked = word.click(this.codemasterScreen, this.codemasterHasToPlay);

      if (clicked) {
        this.clickedOnCurrentTurn += 1;
        if (!(word.cardType() === CardType.BLUE && this.bluePlays) &&
            !(word.cardType() === CardType.RED && !this.bluePlays)) {
          this.codemasterHasToPlay = true;
          this.changeActiveTeam();
        }

        if (this.currentNumberHint > 0 && this.clickedOnCurrentTurn === this.currentNumberHint + 1) {
          this.codemasterHasToPlay = true;
          this.changeActiveTeam();
        }
        this.dump();
      }
    }

    codemasterGivesClue(): void {
      // currentWordHint and currentNumberHint are updated directly in the form
      this.codemasterHasToPlay = false;
      this.gameHasStarted = true;
      this.dump();
    }

    dump() {
      const obj = {
         table: []
      };
      obj.table.push({'words': this.words,
                      'bluePlays': this.bluePlays,
                      'codemasterHasToPlay': this.codemasterHasToPlay,
                      'currentWordHint': this.currentWordHint,
                      'currentNumberHint': this.currentNumberHint,
                      'clickedOnCurrentTurn': this.clickedOnCurrentTurn});

      const json = JSON.stringify(obj);
      console.log(json);
    }
}
