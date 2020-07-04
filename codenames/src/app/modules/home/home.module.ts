import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './components/root/root.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { PlayGameComponent } from './components/play-game/play-game.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { StoreFeedbackComponent } from './components/storefeedback/storefeedback.component';
import { GameScoreComponent } from './components/game-score/game-score.component';
import { QRCodeModule } from 'angularx-qrcode';
import { GaService } from 'src/app/core/services/ext/ga.service';

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
        ReactiveFormsModule,
    ],
  providers: [
    GaService
  ],
  bootstrap: [RootComponent],
  entryComponents: []
})
export class HomeModule {
}
