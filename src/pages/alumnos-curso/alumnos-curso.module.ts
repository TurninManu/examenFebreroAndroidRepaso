import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlumnosCursoPage } from './alumnos-curso';

@NgModule({
  declarations: [
    AlumnosCursoPage,
  ],
  imports: [
    IonicPageModule.forChild(AlumnosCursoPage),
  ],
})
export class AlumnosCursoPageModule {}
