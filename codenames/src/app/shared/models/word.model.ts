export class Word {
    word: string;
    type: number;
    show: boolean;
    ignored: boolean;

    toggle(): void {
        if (!this.show) {
            this.show = true;
            return;
        }
        this.ignored = !this.ignored;
    }

    public getClass(): string {
        return 'card ' + ['', 'blue', 'red', 'death', 'neutral'][this.type] + (this.show ? ' show' : '') + (this.ignored ? ' ignored' : '');
    }
}
