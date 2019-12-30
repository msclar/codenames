import { Injectable } from '@angular/core';

@Injectable()
export class GaService {

    public isEnabled(): boolean {
        return window['ga'] && window['ga'] !== null;
    }

    public create(): void {
        if (!this.isEnabled()) {
            return;
        }
        window['ga']('create', 'UA-154993310-1', 'auto');
    }

    public pageVisited(url: string): void {
        if (!this.isEnabled()) {
            return;
        }
        window['ga']('set', 'page', url);
        window['ga']('send', 'pageview');
    }

    public emitEvent(eventCategory: string,
        eventAction: string,
        eventLabel: string = null,
        eventValue: number = null) {
        if (!this.isEnabled()) {
            console.log('no analytics enabled');
            return;
        }
        window['ga']('send', 'event', {
            eventCategory: eventCategory,
            eventLabel: eventLabel,
            eventAction: eventAction,
            eventValue: eventValue
        });
    }
}