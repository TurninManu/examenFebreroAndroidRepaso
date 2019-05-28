import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Alumno } from '../../modelo/alumno';
import { Falta } from '../../modelo/falta';
import { AlumnoConFalta } from '../../modelo/alumno-con-falta';

/**
 * Generated class for the AlumnosCursoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alumnos-curso',
  templateUrl: 'alumnos-curso.html',
})
export class AlumnosCursoPage {
  fechaSelec:any;
  grupoSelec:any;
  horaSelec:any;
  alumnos:Alumno[]=[];
  faltas:Falta[]=[];

  faltasHora:Falta[]=[];
  alumnosConFalta:AlumnoConFalta[]=[];


  diasSeamana=['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  dia:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fechaSelec=this.navParams.get('fecha');
    this.grupoSelec=this.navParams.get('grupo');
    this.horaSelec=this.navParams.get('hora');
    this.alumnos=this.navParams.get('alumnos');
    this.faltas=this.navParams.get('faltas');

    this.dia=this.diasSeamana[new Date(this.fechaSelec).getDay()];

    this.faltas.forEach(element => {
      if(element.idHora=='6')
      this.faltasHora.push(element);
    });
    console.log(this.faltasHora);

    let salir=false;
    this.alumnos.forEach(a => {
      for (let i = 0; i < this.faltasHora.length && salir==false; i++) {
        if(a.key==this.faltasHora[i].idAlumno){
          this.alumnosConFalta.push(new AlumnoConFalta(a.key, a.apellidos, a.nombre, this.faltasHora[i].estado));
          salir=true;
        }else{
          this.alumnosConFalta.push(new AlumnoConFalta(a.key, a.apellidos, a.nombre, "ASISTE"));
          salir=true;
        }     
      }
      salir=false;
    });
    console.log("sin faltas",this.alumnos)
      console.log("con faltas", this.alumnosConFalta);
  }

  ionViewDidLoad() {




  }

}
