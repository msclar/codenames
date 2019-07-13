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

    public toggle(): void {
        this.selected = !this.selected;
    }

    public getClass(): string {
        return 'card'; // + CardType[this.type].toLowerCase() + (this.s ? ' show' : '') + (this.ignored ? ' ignored' : '');
    }
}
