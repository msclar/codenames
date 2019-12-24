import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './components/root/root.component';
import { FormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { PlayGameComponent } from './components/play-game/play-game.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { StoreFeedbackComponent } from './components/storefeedback/storefeedback.component';
import { GameScoreComponent } from './components/game-score/game-score.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    RootComponent,
    StartGameComponent,
    PlayGameComponent,
    GameScoreComponent,
    StoreFeedbackComponent
  ],
  imports: [
    BrowserModule,
    HomeRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    QRCodeModule,
  ],
  providers: [{
    provide: Window, useValue: window
  }],
  bootstrap: [RootComponent],
  entryComponents: []
})
export class HomeModule {
}
