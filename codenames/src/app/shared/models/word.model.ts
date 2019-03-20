export enum CardType {
    BLUE,
    RED,
    DEATH,
    NEUTRAL
}

export class Word {
    word: string;
    type: CardType;
    show: boolean;
    ignored: boolean;

    public toggle(): void {
        if (!this.show) {
            this.show = true;
            return;
        }
        this.ignored = !this.ignored;
    }

    public getClass(): string {
        return 'card ' + CardType[this.type].toLowerCase() + (this.show ? ' show' : '') + (this.ignored ? ' ignored' : '');
    }
}
