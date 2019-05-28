import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { snapshotToArray } from '../../app/envroiments';
import { Grupo } from '../../modelo/grupo';
import { Hora } from '../../modelo/hora';
import { AlumnosCursoPage } from '../alumnos-curso/alumnos-curso';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  grupos:Grupo[];
  horas:Hora[];
  ref=firebase.database().ref('/');

  fechaActual:string=new Date().toLocaleDateString();;

  fechaSelec:any;
  grupoSelec:any;
  horaSelec:any;


  constructor(public navCtrl: NavController) {
    this.ref.on('value', res=>{
      this.grupos=snapshotToArray(res.child('grupos/'));
      this.horas=snapshotToArray(res.child('horas/'));
    });

    
  }

  public buscar(){
    this.navCtrl.push(AlumnosCursoPage, {fecha:this.fechaSelec, grupo:this.grupoSelec, hora:this.horaSelec});
  }
}
