import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { snapshotToArray } from '../../app/envroiments';
import { Alumno } from '../../modelo/alumno';
import { Falta } from '../../modelo/falta';
import { Grupo } from '../../modelo/grupo';
import { Hora } from '../../modelo/hora';
import { AlumnosCursoPage } from '../alumnos-curso/alumnos-curso';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  alumnos:Alumno[];
  faltas:Falta[];
  grupos:Grupo[];
  horas:Hora[];
  ref=firebase.database().ref('/');

  fechaActual:string=new Date().toLocaleDateString();;

  fechaSelec:any;
  grupoSelec:any;
  horaSelec:any;

  alumnosGrupos:Alumno[]=[];
  faltasFechas:Falta[]=[];

  constructor(public navCtrl: NavController) {
    this.ref.on('value', res=>{
      this.alumnos=snapshotToArray(res.child('alumnos/'));
      this.faltas=snapshotToArray(res.child('faltas/'));
      this.grupos=snapshotToArray(res.child('grupos/'));
      this.horas=snapshotToArray(res.child('horas/'));
    });

    
  }

  public buscar(){
    this.alumnos.forEach(element => {
      if(element.idGrupo==this.grupoSelec)
        this.alumnosGrupos.push(element);
    });
    this.faltas.forEach(element =>{
      if(element.fecha==this.fechaSelec)
        this.faltasFechas.push(element);
    });

    this.navCtrl.push(AlumnosCursoPage, {fecha:this.fechaSelec, grupo:this.grupoSelec, hora:this.horaSelec, 
      alumnos:this.alumnosGrupos, faltas:this.faltasFechas});
  }
}
