const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


    
    


exports.backupSwitched = functions.database.ref('{uid}/{roomid}/modules/{switchid}')
.onUpdate((changes,context)=>{
    const userId = context.params.uid;
    const roomId = context.params.roomid; 
    const switchId = context.params.switchid;    
    var str1 = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var currentdate = str1.replace (/[/]/g, "");
   // var datetime =  currentdate.getDate() + (("0" + (currentdate.getMonth() + 1)).slice(-2))+currentdate.getFullYear()+(("0" + (currentdate.getHours())).slice(-2)); 
    return admin.database().ref(userId+'/'+roomId+'/backup/'+switchId+'/'+currentdate).set(changes.after.val());
})
exports.backupSensors = functions.database.ref('{uid}/{roomid}/sensors/{sensorid}')
.onUpdate((changes,context)=>{
    const userId = context.params.uid;
    const roomId = context.params.roomid; 
    const sensorId = context.params.sensorid;
    var str1 = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var currentdate = str1.replace (/[/]/g, "");
   // var datetime =  currentdate.getDate() + (("0" + (currentdate.getMonth() + 1)).slice(-2))+currentdate.getFullYear()+(("0" + (currentdate.getHours())).slice(-2)); 
    return admin.database().ref(userId+'/'+roomId+'/backup/'+sensorId+'/'+currentdate).set(changes.after.val());
})

exports.gasDetection = functions.database.ref('{uid}/{roomid}/sensors/gas')
.onUpdate((changes,context)=>{
    const userId = context.params.uid;
    const roomId = context.params.roomid; 
    var str1 = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var info={
        "room":roomId,
        "time":str1,
        "status":"Alert"
    };
    var nonee={
        "room":'',
        "time":'',
        "status":""
    };
    if(changes.after.val()>500 && changes.after.val()>changes.before.val()){
       return admin.database().ref(userId+'/alerts/').child('gas').update(info);
    }
    else if(changes.after.val()>500 && changes.after.val()<changes.before.val()){
        return ;
     }
    else{
        return admin.database().ref(userId+'/alerts/').child('gas').update(nonee);
    }
    
})

exports.secPIR = functions.database.ref('{uid}/{roomid}/sensors/pir')
.onUpdate((changes,context)=>{
    const userId = context.params.uid;
    const roomId = context.params.roomid; 
    var str1 = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var info={
        "room":roomId,
        "time":str1,
        "status":"Alert"
    };
    var nonee={
        "room":'',
        "time":'',
        "status":""
    };

    var modules={
        "s1":"off",
        "s2":"off",
        "s3":"off",
        "s4":"off"
    }
    if(changes.after.val().value>500 && changes.after.val().mode==1){
       return admin.database().ref(userId+'/alerts/').child('pir').update(info);
    }
    else if(changes.after.val().value<=500 && changes.after.val().mode!=1){
         return admin.database().ref(userId+'/'+roomId).child('modules').update(modules);
     }
    else{
        return admin.database().ref(userId+'/alerts/').child('pir').update(nonee);
    }
    
})