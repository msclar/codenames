import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayGameComponent } from './components/play-game/play-game.component';
import { StartGameComponent } from './components/start-game/start-game.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    component: StartGameComponent
  },
  {
    path: 'play',
    component: PlayGameComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
