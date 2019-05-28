import { Alumno } from './../../modelo/alumno';
import { Hora } from './../../modelo/hora';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Falta } from '../../modelo/falta';
import { AlumnoConFalta } from '../../modelo/alumno-con-falta';
import firebase from 'firebase';
import { snapshotToArray } from '../../app/envroiments';

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


  alumnos:Alumno[];
  faltas:Falta[];
  horas:Hora[];
  

  ref=firebase.database().ref('/');

  faltasHora:Falta[]=[];
  alumnosConFalta:AlumnoConFalta[]=[];


  diasSeamana=['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  dia:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertController: AlertController) {
    this.fechaSelec=this.navParams.get('fecha');
    this.grupoSelec=this.navParams.get('grupo');
    this.horaSelec=this.navParams.get('hora');

    this.dia=this.diasSeamana[new Date(this.fechaSelec).getDay()];

    this.ref.on('value', res=>{
      this.alumnos=snapshotToArray(res.child('alumnos/'));
      this.faltas=snapshotToArray(res.child('faltas/'));
      this.horas=snapshotToArray(res.child('horas/'));
    });

    console.log(this.faltas);

    //FILTRAMOS LOS ALUMNOS DEL GRUPO SELECCIONADO
    this.filtrarAlumnos();

    //FILTRAMOS LAS FALTAS
    this.filtrarFaltas();


   this.cargarAlumnosConFaltas();

  }

  ionViewDidLoad() {}

  public siguienteHora(){
    if(this.horaSelec<this.horas.length){
      this.horaSelec++;
      this.filtrarFaltas();
      this.cargarAlumnosConFaltas();
    }
  }

  public anteriorHora(){
    if(this.horaSelec>1){
      this.horaSelec--;
      this.filtrarFaltas();
      this.cargarAlumnosConFaltas();
    }
  }

  public falta(indice:number){
    let alumnoAux:AlumnoConFalta=this.alumnosConFalta[indice];
    if(alumnoAux.falta=="ASISTE"){
      alumnoAux.falta="INJUSTIFICADA";
      this.faltas.push(new Falta("INJUSTIFICADA", this.fechaSelec, alumnoAux.id, this.horaSelec));
    }else if(alumnoAux.falta=="INJUSTIFICADA"){
      alumnoAux.falta="JUSTIFICADA";

      let salir=false;
      for (let i = 0; i < this.faltas.length && salir; i++) {
        const element = this.faltas[i];
        if(alumnoAux.id==element.idAlumno){
          this.faltas[i].estado="JUSTIFICADA";
          salir=true;
        }
      }
      
    }else if(alumnoAux.falta=="JUSTIFICADA"){
      alumnoAux.falta="ASISTE";

      let salir=false;
      for (let i = 0; i < this.faltas.length && salir; i++) {
        const element = this.faltas[i];
        if(alumnoAux.id==element.idAlumno){
          this.faltas.splice(i,1);
          salir=true;
        }
      }
    }
  }

  public guardar(){
    const alert = this.alertController.create({
      title: 'Confirmación!',
      message: '¿Seguro que desea Guardar?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          handler: () => {
            firebase.database().ref('faltas/').remove();
            firebase.database().ref('faltas/').update(this.faltas);
          }
        }
      ]
    });

    alert.present();
  }

  private filtrarFaltas(){
    this.faltasHora=[];
    this.faltas.forEach(element => {
      if(element.idHora==this.horaSelec)
        this.faltasHora.push(element);
    });
  }

  private filtrarAlumnos(){
    let alumnosAux:Alumno[]=[];
    this.alumnos.forEach(alum => {
      if(alum.idGrupo==this.grupoSelec)
        alumnosAux.push(alum);
    });
    this.alumnos=alumnosAux;
  }

  private cargarAlumnosConFaltas(){
    this.alumnosConFalta=[];
    let tipoDeFalta="";
    this.alumnos.forEach(a => {
      if(this.faltasHora.length>0){
        this.faltasHora.forEach(f => {
          if(a.key==f.idAlumno)
            tipoDeFalta=f.estado;
          else
            if(tipoDeFalta=="")
              tipoDeFalta="ASISTE";
        });
      }else{
        tipoDeFalta="ASISTE";
      }
      this.alumnosConFalta.push(new AlumnoConFalta(a.key, a.apellidos, a.nombre, tipoDeFalta));
      tipoDeFalta="";
    });
  }

}
