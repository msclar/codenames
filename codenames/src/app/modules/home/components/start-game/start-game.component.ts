import { Component, OnInit } from '@angular/core';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.css']
})
export class StartGameComponent implements OnInit {
  gameid = '';

  constructor(
    private gameStore: GamesStore,
    private router: Router
  ) { }

  ngOnInit() {
  }

  enter(asCodeMaster: boolean): void {
    this.gameStore.createNew(this.gameid, asCodeMaster);
    this.router.navigate(['/play']);
  }

}
