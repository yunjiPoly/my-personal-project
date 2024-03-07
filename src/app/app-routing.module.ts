import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BASE, CREATE, FEED } from './consts/routes.const';
import { CreateComponent } from './components/create/create.component';
import { FeedComponent } from './components/feed/feed.component';
//import { WipComponent } from './components/wip/wip.component';
//import { UnderConstructionPageComponent } from './components/under-construction-page/under-construction-page.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([FEED]);

const routes: Routes = [
  { path: BASE, redirectTo: `/${FEED}`, pathMatch: 'full', },
  { path: FEED, component: FeedComponent, },
  { path: CREATE, component: CreateComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, },
  //{ path: TEMPORARY_WIP, component: WipComponent },
  //{ path: UNDER_CONSTRUCTION, component: UnderConstructionPageComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
