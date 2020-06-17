import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { CharacterCreationComponent } from './components/character-creation/character-creation/character-creation.component';
import { FightComponent } from './components/fight/fight/fight.component';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { StartComponent } from './components/start/start/start.component';
import { StoryComponent } from './components/story/story/story.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterCreationComponent,
    FightComponent,
    InventoryComponent,
    StartComponent,
    StoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
