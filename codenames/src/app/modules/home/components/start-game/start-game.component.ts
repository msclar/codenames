import { Component, OnInit, Inject } from '@angular/core';
import { GamesStore } from 'src/app/core/services/store/games.store';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GaService } from 'src/app/core/services/ext/ga.service';
import {filter, map} from 'rxjs/operators';
import {Store} from '../../../../core/services/store/stores';
import {LanguageEntry} from '../../../../core/services/asset/dictionary.service';

const wordsForGameId = ['africa', 'agent', 'air', 'alien', 'alps', 'amazon', 'ambulance',
  'america', 'angel', 'antarctica', 'apple', 'arm', 'atlantis', 'australia', 'aztec',
  'back', 'ball', 'band', 'bank', 'bar', 'bark', 'bat', 'battery', 'beach', 'bear',
  'beat', 'bed', 'beijing', 'bell', 'belt', 'berlin', 'bermuda', 'berry', 'bill',
  'block', 'board', 'bolt', 'bomb', 'bond', 'boom', 'boot', 'bottle', 'bow', 'box',
  'bridge', 'brush', 'buck', 'buffalo', 'bug', 'bugle', 'button', 'calf', 'canada', 'cap',
  'capital', 'car', 'card', 'carrot', 'casino', 'cast', 'cat', 'cell', 'centaur', 'center',
  'chair', 'change', 'charge', 'check', 'chest', 'chick', 'china', 'chocolate', 'church',
  'circle', 'cliff', 'cloak', 'club', 'code', 'cold', 'comic', 'compound', 'concert',
  'conductor', 'contract', 'cook', 'copper', 'cotton', 'court', 'cover', 'crane', 'crash',
  'cricket', 'cross', 'crown', 'cycle', 'czech', 'dance', 'date', 'day', 'death', 'deck',
  'degree', 'diamond', 'dice', 'dinosaur', 'disease', 'doctor', 'dog', 'draft', 'dragon',
  'dress', 'drill', 'drop', 'duck', 'dwarf', 'eagle', 'egypt', 'embassy', 'engine', 'england',
  'europe', 'eye', 'face', 'fair', 'fall', 'fan', 'fence', 'field', 'fighter', 'figure', 'file',
  'film', 'fire', 'fish', 'flute', 'fly', 'foot', 'force', 'forest', 'fork', 'france', 'game',
  'gas', 'genius', 'germany', 'ghost', 'giant', 'glass', 'glove', 'gold', 'grace', 'grass',
  'greece', 'green', 'ground', 'ham', 'hand', 'hawk', 'head', 'heart', 'helicopter', 'himalayas',
  'hole', 'hollywood', 'honey', 'hood', 'hook', 'horn', 'horse', 'horseshoe', 'hospital', 'hotel',
  'ice', 'ice', 'cream', 'india', 'iron', 'ivory', 'jack', 'jam', 'jet', 'jupiter', 'kangaroo', 'ketchup', 'key', 'kid', 'king', 'kiwi', 'knife', 'knight', 'lab', 'lap', 'laser', 'lawyer', 'lead', 'lemon', 'leprechaun', 'life', 'light', 'limousine', 'line', 'link', 'lion', 'litter', 'loch', 'ness', 'lock', 'log', 'london', 'luck', 'mail', 'mammoth', 'maple', 'marble', 'march', 'mass', 'match', 'mercury', 'mexico', 'microscope', 'millionaire', 'mine', 'mint', 'missile', 'model', 'mole', 'moon', 'moscow', 'mount', 'mouse', 'mouth', 'mug', 'nail', 'needle', 'net', 'new', 'york', 'night', 'ninja', 'note', 'novel', 'nurse', 'nut', 'octopus', 'oil', 'olive', 'olympus', 'opera', 'orange', 'organ', 'palm', 'pan', 'pants', 'paper', 'parachute', 'park', 'part', 'pass', 'paste', 'penguin', 'phoenix', 'piano', 'pie', 'pilot', 'pin', 'pipe', 'pirate', 'pistol', 'pit', 'pitch', 'plane', 'plastic', 'plate', 'platypus', 'play', 'plot', 'point', 'poison', 'pole', 'police', 'pool', 'port', 'post', 'pound', 'press', 'princess', 'pumpkin', 'pupil', 'pyramid', 'queen', 'rabbit', 'racket', 'ray', 'revolution', 'ring', 'robin', 'robot', 'rock', 'rome', 'root', 'rose', 'roulette', 'round', 'row', 'ruler', 'satellite', 'saturn', 'scale', 'school', 'scientist', 'scorpion', 'screen', 'scuba', 'diver', 'seal', 'server', 'shadow', 'shakespeare', 'shark', 'ship', 'shoe', 'shop', 'shot', 'sink', 'skyscraper', 'slip', 'slug', 'smuggler', 'snow', 'snowman', 'sock', 'soldier', 'soul', 'sound', 'space', 'spell', 'spider', 'spike', 'spine', 'spot', 'spring', 'spy', 'square', 'stadium', 'staff', 'star', 'state', 'stick', 'stock', 'straw', 'stream', 'strike', 'string', 'sub', 'suit', 'superhero', 'swing', 'switch', 'table', 'tablet', 'tag', 'tail', 'tap', 'teacher', 'telescope', 'temple', 'theater', 'thief', 'thumb', 'tick', 'tie', 'time', 'tokyo', 'tooth', 'torch', 'tower', 'track', 'train', 'triangle', 'trip', 'trunk', 'tube', 'turkey', 'undertaker', 'unicorn', 'vacuum', 'van', 'vet', 'wake', 'wall', 'war', 'washer', 'washington', 'watch', 'water', 'wave', 'web', 'well', 'whale', 'whip', 'wind', 'witch', 'worm', 'yard']

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss']
})
export class StartGameComponent implements OnInit {
  public gameid;
  public language;


  constructor(
    private gameStore: GamesStore,
    private router: Router,
    private gaService: GaService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.language = 'en';
    this.gameid = this.generateRandomString();
  }

  ngOnInit() {
  }

  enter(): void {
    this.gameStore.createNew(this.gameid, this.language);
    this.gaService.emitEvent('codenames', 'start', this.gameid, 1);
    this.router.navigate(['/play']);
  }

  public get link(): string {
    return this.document.location.toString();
  }

  private generateRandomString(): string {
    let res = wordsForGameId[Math.floor(Math.random() * wordsForGameId.length)];
    for (let i = 0; i < 2; i++) {
      res += '-' + wordsForGameId[Math.floor(Math.random() * wordsForGameId.length)];
    }
    return res;
  }

  updateLang(language: string) {
    this.language = language;
  }
}
