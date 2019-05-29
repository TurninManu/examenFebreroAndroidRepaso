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
  refAlumnos:any;
  refFaltas:any;



  faltasHora:Falta[]=[];
  faltasCopia:Falta[];
  alumnosConFalta:AlumnoConFalta[]=[];


  diasSeamana=['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  dia:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertController: AlertController) {
    this.fechaSelec=this.navParams.get('fecha');
    this.grupoSelec=this.navParams.get('grupo');
    this.horaSelec=this.navParams.get('hora');

    this.dia=this.diasSeamana[new Date(this.fechaSelec).getDay()];

    this.ref.on('value', res=>{
      this.horas=snapshotToArray(res.child('horas/'));
    });


    this.refAlumnos=firebase.database().ref('alumnos/').orderByChild('idGrupo').startAt(this.grupoSelec).endAt(this.grupoSelec);
    this.refAlumnos.on('value', res=>{
      this.alumnos=snapshotToArray(res);
    });

    this.refFaltas=firebase.database().ref('faltas/').orderByChild('fecha').startAt(this.fechaSelec).endAt(this.fechaSelec);
    this.refFaltas.on('value', res=>{
      this.faltas=snapshotToArray(res);
    });

    //FILTAMOS LAS FALTAS A LA HORA SELECCIONADA
    this.filtrarFaltas();

    this.faltasCopia=this.faltas;


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
      this.faltasCopia.push(new Falta(null, "INJUSTIFICADA", this.fechaSelec, alumnoAux.id, this.horaSelec));
    }else if(alumnoAux.falta=="INJUSTIFICADA"){
      alumnoAux.falta="JUSTIFICADA";

      let salir=false;
      for (let i = 0; i < this.faltasCopia.length && !salir; i++) {
        const element = this.faltasCopia[i];
        if(alumnoAux.id==element.idAlumno){
          this.faltasCopia[i].estado="JUSTIFICADA";
          salir=true;
        }
      }
      
    }else if(alumnoAux.falta=="JUSTIFICADA"){
      alumnoAux.falta="ASISTE";
      let salir=false;
      for (let i = 0; i < this.faltasCopia.length && !salir; i++) {
        const element = this.faltasCopia[i];
        if(alumnoAux.id==element.idAlumno){
          this.faltasCopia.splice(i,1)
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
            this.faltas.forEach(falta => {
              this.faltasCopia.forEach(faltaCopia => {
                //COMPROBAMOS SI TIENE EL MISMO ID
                if(falta.key==faltaCopia.key){
                //COMPROBAMOS QUE EL ESTADO NO HA CAMBIADO

                //SI HA CAMBIADO A ASISTE, LO BORRAMOS DE FIRESASE
                if(faltaCopia.estado=="ASISTE"){
                  firebase.database().ref('faltas/'+falta.key).remove();
                }
                //SI HA CAMBIADO A OTRO TIPO, REALIZAMOS EL CAMBIO
                else if(falta.estado!=faltaCopia.estado){
                  let faltaAux=faltaCopia;
                  firebase.database().ref('faltas/'+falta.key).update(faltaAux);
                }
                 
                }
                //SI ES NUEVO LO AÑADIMOS
                else{
                  console.log("falso");
                  //firebase.database().ref('faltas/').push(faltaCopia);
                }

              });//FIN FOR FALTASCOPIA
            });//FIN FOR FALTAS

            
          }//FIN HANDLER
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
