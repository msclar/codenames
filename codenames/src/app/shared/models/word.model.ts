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
    ) {
        this.selected = false;
    }
    selected: boolean;

    public click(isCodemasterScreen: boolean, codemasterHasToPlay: boolean): boolean {
        console.log('clicked');
        if (!this.selected && !isCodemasterScreen && !codemasterHasToPlay) {
          this.selected = !this.selected;
          return true;
        }
        return false;
    }

    public cardType(): CardType {
        return this.type;
    }

    public stringy(): string {
        return this.word;
    }
}
