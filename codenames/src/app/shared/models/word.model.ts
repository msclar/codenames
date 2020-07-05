export enum CardType {
    BLUE,
    RED,
    DEATH,
    NEUTRAL
}

export class Word {
    constructor(
        public readonly word: string
        , public readonly type: CardType
        , public selected: boolean = false
    ) {
    }

    public click(isCodemasterScreen: boolean, codemasterHasToPlay: boolean): boolean {
        if (!this.selected && !isCodemasterScreen && !codemasterHasToPlay) {
          this.selected = !this.selected;
          return true;
        }
        return false;
    }

    public cardType(): CardType {
        return this.type;
    }
}
