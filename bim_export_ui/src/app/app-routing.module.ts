import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UploadComponent} from './components/upload/upload.component';
import { AuthGuardService } from './services/auth-guard.service';
import { from } from 'rxjs';
import { HomeComponent } from './components/Home/home.component';
import { ViewerComponent } from './components/viewer/viewer.component';

const routes: Routes = [
  // { path: '', children: []},
  { path: '', redirectTo:'home', pathMatch:'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuardService]},
  { path: 'viewer', component: ViewerComponent, canActivate: [AuthGuardService]},
  
  // { path: 'auth', component: HomeComponent, pathMatch: 'full'},
  // { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    // RouterModule.forRoot(routes, {
    //   useHash: false, initialNavigation: false
    // })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
