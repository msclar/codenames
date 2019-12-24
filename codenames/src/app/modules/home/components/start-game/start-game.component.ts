import { Component, OnInit, Inject } from '@angular/core';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Router } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss']
})
export class StartGameComponent implements OnInit {
  gameid = '';
  typeSecret = true;
  startRandom = false;

  constructor(
    private gameStore: GamesStore,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
  }

  enter(asCodeMaster: boolean): void {
    this.gameStore.createNew(this.gameid, asCodeMaster);
    this.router.navigate(['/play']);
  }

  public get link(): string {
    return this.document.location.toString();
  }

  public takeRandom(): void {
    this.gameid = this.generateRandomString(10);
  }

  private generateRandomString(length: number): string {
    const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    for (let i = 0; i < length; i++) {
      res += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return res;
  }

}
