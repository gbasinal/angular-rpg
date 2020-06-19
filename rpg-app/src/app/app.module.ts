import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { CharacterCreationComponent } from './components/character-creation/character-creation/character-creation.component';
import { FightComponent } from './components/fight/fight/fight.component';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { StartComponent } from './components/start/start/start.component';
import { StoryComponent } from './components/story/story/story.component';
import { GameControllerService } from './services/game-controller.service';

// Route is where you will creat the urls for the component's display
const routes: Routes = [
  // empty string means once you are on the base url, the start component will display
  {path: "", component: StartComponent},
  {path: "story", component: StoryComponent},
  {path: "character-creation", component: CharacterCreationComponent},
  {path: "fight", component: FightComponent},
  {path: "", component: StartComponent},
  // ** means that when a user tries to navigate to any random end url , the user will be directed to the base url
  {path: "**", redirectTo: ""}
]

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
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [
    GameControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
