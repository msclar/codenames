import { Word } from './word.model';

export class Game {
    constructor(
        public readonly seed: string
        , public readonly isLocalCodeMaster: boolean
    ) {
    }
    words: Word[] = [];
}
