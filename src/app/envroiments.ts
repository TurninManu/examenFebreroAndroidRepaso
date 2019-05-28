export const firebaseConfig = {
    apiKey: "AIzaSyCOPfaVqEqbIBauL76KWlHWFPHmmgmL_1s",
    authDomain: "examenfebreroandroidenionic.firebaseapp.com",
    databaseURL: "https://examenfebreroandroidenionic.firebaseio.com",
    projectId: "examenfebreroandroidenionic",
    storageBucket: "examenfebreroandroidenionic.appspot.com",
    messagingSenderId: "864238499735",
    appId: "1:864238499735:web:00c35e9fb037cb00"
  };

  export const snapshotToArray=snapshot=>{
    let returnArray=[];
    snapshot.forEach(element => {
      let item=element.val();
      item.key=element.key;
      returnArray.push(item);
    });
    return returnArray;
  }