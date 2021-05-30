const colorVariable = {
  greenPrimary: "#67bdb3",
  redLight: "#f36a6a",
  light: "#f4f4f4",
  greenLight: "#a9d79d",
  primary: "#56ccf2",
  primaryLight: "#cfe8ee",
  gray4: "#bdbdbd",
  gray5: "#e0e0e0",
  gray3: "#828282",
  darkPrimary: "#51bbdd",
  redDark: "#e76767",
  convertRGBtoHex: function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return rgb && rgb.length === 4
    ? "#" +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
    : orig;
  },
};
let audioID,audioBlobNow,isNewRecord,NameRecord="Empty";
let AudioSrc;

function getNameRecord()
{
  return NameRecord;
}
function setNameRecord(name)
{
  NameRecord=name;
}
function getAudioID()
{
  return audioID;
}
function setAudioID(id)
{
  audioID=id;
}


// document.querySelector("#date").setAttribute("min",new Date());
const UIController = (function () {
  const UISelector = {
    microphone: "#microphone",
    modalBtn: ".modalBtn",
    closeBtn: ".closeBtn",
    microphone: "#microphone",
    modalName: "#popupName",
    modalSend: "#popupSend",
    textMicrophone: "#text-microphone",
    listPeopleItem: ".listPeopleItem",
    playButton: ".play-button",
    statusTable: "#status-table",
    recordList: "#recorded-list",
    popupName: "#popupName",
    popupSend: "#popupSend",
    onlineList: "#online-list",
    listPeople: "#listPeople"
    
  };
  const UIPath={
    pauseSvg: "resource/pause.svg",
    playSvg: "resource/play-button.svg",
    accept: "resource/check-mark.svg",
    waiting:"resource/time-left.svg",
    reject: "resource/cancel.svg"
  };
  
  // Record from microphone
  const mic = document.querySelector(UISelector.microphone);
  const textMicrophone = document.querySelector(UISelector.textMicrophone);

  function toggleMic() {
    if (
      colorVariable.convertRGBtoHex(mic.style.backgroundColor) ===
      colorVariable.primary
      ) {
        recording();
        return;
      }else if(colorVariable.convertRGBtoHex(mic.style.backgroundColor) ===
      colorVariable.redLight)
      {
        openModal("modalName");
        return;
      }
      idle();
  }
  function idle()
  {
      mic.style.backgroundColor = colorVariable.primary;
      textMicrophone.innerHTML = "Click the button<br>to start a new record";
  }
  function recording(){
      
    navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext;
    const input = audioContext.createMediaStreamSource(stream);
    const rec = new Recorder(input, {
        numChannels: 1
    }) 
    rec.record()
    function blobCallBack(audioBlob) {
      audioBlobNow=audioBlob;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      // do something with audio
      //audio.play();
      updateModalSrcFile(audioUrl);
      AudioSrc=audioUrl;
      openModal("modalName");
      console.log(audioBlob);
    }

    setTimeout(() => {
      rec.stop();
      rec.exportWAV(blobCallBack)
    }, 5000);
  });



      mic.style.backgroundColor = colorVariable.redLight;
      textMicrophone.innerHTML = "Recording\.\.\.<br>only 5 seconds";
      
  }
  function openModal(modalReference) {
      document.querySelector(UISelector[modalReference]).style.display = "block";
  }
  const listPeopleItem = document.querySelectorAll(UISelector.listPeopleItem);
  function unchecked()
  {
    listPeopleItem.forEach((e)=>{
      e.children[0].checked=false;
      console.log(e.child);
    });
  }
  
  function closeModals() {
    document.querySelector(UISelector.modalName).style.display = "none";
    document.querySelector(UISelector.modalSend).style.display = "none";
    resetState();
  }
  const msg = document.querySelector("#error-time");
  function resetMsg()
  {
    msg.innerHTML="--- Please pick Time&Date vaild ---";
    msg.classList.remove("error");
  }
  function setMsgErrorTime()
  {
    msg.innerHTML="--- Invalid Time&Date ---";
    msg.classList.add("error");
  }
  function setMsgErrorEmptySelect()
  {
    msg.innerHTML="--- Empty Device to send ---";
    msg.classList.add("error");
  }

  // Play Pause
  function playSound(e)
  {
    e.classList.add("pause");
    e.src=UIPath.pauseSvg;
    e.nextElementSibling.play()
  }
  function pauseSound(e)
  {
    e.classList.remove("pause");
    e.src=UIPath.playSvg;
    e.nextElementSibling.pause();
    
  }
  const playButtons= document.querySelectorAll(UISelector.playButton);
  // console.log(playButtons);
  function pauseAll(except)
  {
    playButtons.forEach((e) => {
      if(e!=except)
        pauseSound(e);
    });
  }

  // Add row
  let statusTable=document.querySelector(UISelector.statusTable);
  let recordList=document.querySelector(UISelector.recordList);
  let onlineList = document.querySelector(UISelector.onlineList);
  let listPeople = document.querySelector(UISelector.listPeople);
  // Add status row
  function addStatus(targetName,targetFileName,sendTime,sendDate,/*sendResponse,*/backResponse)
  {
    let row = document.createElement("div");
    row.className='item-status';
    let target=document.createElement("div");
    target.className="target";
    target.innerHTML=`<div class="target-name">${targetName}</div>
                      <div class="target-filename">[${targetFileName}]</div>`;
    row.appendChild(target);
    let send=document.createElement("div");
    send.className="send";
    // <img class="send-icon icon" src=${UIPath[sendResponse]}></img>
    send.innerHTML=`
                    <div class="send-time">
                    <div class="send-hour">${sendTime}</div>
                    <div class="send-date">${sendDate}</div>
                    </div>`;
    row.appendChild(send);
    let back_response=document.createElement("div");
    back_response.className="response";
    back_response.innerHTML=`<img class="response-icon icon" src=${UIPath[backResponse]}></img>`;
    row.appendChild(back_response);
    statusTable.appendChild(row);
  }
  // Add record row
  function addRecord(srcFile,nameFile,idFile){
    let row=document.createElement("div");
    row.className="recorded";
      let player = document.createElement("div");
      player.className="player";
        let imgPlay = document.createElement("img");
        imgPlay.src = "resource/play-button.svg";
        imgPlay.className= "icon play-button";
        BtnController.addEventListenerPlayBtn(imgPlay);
    
        let audioTag = document.createElement("audio");
        audioTag.src=srcFile;
        audioTag.id=idFile;
        BtnController.addEventListenerAudio(audioTag);
      
        let nameRecord = document.createElement("div");
        nameRecord.className = "name-recorded";
        nameRecord.innerHTML=nameFile;

      player.appendChild(imgPlay);
      player.appendChild(audioTag);
      player.appendChild(nameRecord);

      let btnEvent = document.createElement("button");
      btnEvent.className="btn-primary modalSendBtn modalBtn  button";
      btnEvent.innerHTML="Send";
      BtnController.addEventListenerModalBtn(btnEvent);
      BtnController.addEventListenerSendBtn(btnEvent);

    row.appendChild(player);
    row.appendChild(btnEvent);
    

    recordList.appendChild(row);
  }

  // Add person
  function addPerson(name,status)
  {
    let row=document.createElement("div");
    row.className="online-row";
    let icon = document.createElement("div");
    icon.className = "online-icon";
    if(status==0)
      updateOnlineStatus(icon,0);
    else updateOnlineStatus(icon,1);

    let div_name = document.createElement("div");
    div_name.className="online-name";
    div_name.innerHTML=name;
    row.appendChild(icon);
    row.appendChild(div_name);
    
    onlineList.appendChild(row);
  }
  function addListPeopleToSelect(name,idDevice)
  {
    let row=document.createElement("div");
    row.className="listPeopleItem";
      let chkBox=document.createElement("input");
      chkBox.type="checkbox";
      chkBox.id=idDevice;
      chkBox.name=idDevice;

      let label = document.createElement("label");
      label.htmlFor=idDevice;
      label.innerHTML=name;

      row.appendChild(chkBox);
      row.appendChild(label);

    listPeople.appendChild(row);
  }
  
  function genAudios()
  {
    recordList.innerHTML="";
    getAudios().then(response =>
      {
        response.data.forEach(e =>
          {
            addRecord(getUrlAudioById(e["id"]),e["name"],e["id"]);
          })
          
      });
        
  }
  function genSchedules()
  {
    statusTable.innerHTML="";
    getSchedules().then(response =>{
  
      response.data.forEach(schedule => {
        let scheduleID = schedule["id"];
        let nameFile = schedule["name"];
        let timeSend = new Date(schedule["time"]);
        let receivers = schedule["receivers"];
        let idAudio = schedule["audio"];
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        let time = timeSend.getHours() + ":"+zeroPad(timeSend.getMinutes(),2);
        let m=timeSend.getMonth()+1;
        let date = zeroPad(timeSend.getDate(),2)+"/"+ zeroPad(m,2) + "/"+ zeroPad(timeSend.getFullYear()%100,2);
  
        getScheduleResponse(scheduleID).then(responseTargets =>{
  
          responseTargets.data.forEach(target => {
            let targetID = target["receiver_id"];
            let finished = target["finished"];
  
            getDevice(targetID).then(infoDevice =>{
              let targetName = infoDevice.data["name"];
  
              if(finished)
              {
                addStatus(targetName,nameFile,time,date,"accept");
              }else {
                addStatus(targetName,nameFile,time,date,"reject");
              }
  
            });
          })
  
  
        });
  
  
      });
  
    });

  }

  function genDevices()
  {
    onlineList.innerHTML="";
    listPeople.innerHTML="";
    getDevices().then(people =>{
  
      people.data.forEach(e =>{
        let last_online=new Date(e["last_online"]);
        if(new Date()-last_online<120000)
          addPerson(e["name"],1); // online
        else addPerson(e["name"],0);
        addListPeopleToSelect(e["name"],e["id"]);
  
      })
  
    });

  }

  function setupAll()
  {
    // All record
    genAudios();

    // All status
    genSchedules();

    // All People
    genDevices();
  
  }







  function updateOnlineStatus(row,status)
  {
    row.classList.remove("offline-color");
    row.classList.remove("online-color");
    // status = 0 offline
    // status = 1 online
    if(status==0)
      row.classList.add("offline-color");
    else if(status==1)
      row.classList.add("online-color")
  }


  // Create
  const popupName=document.querySelector(UISelector.popupName);
  const popupSend=document.querySelector(UISelector.popupSend);

  // Update src file modal name
  function updateModalSrcFile(srcFile){
    popupName.querySelector("audio").src=srcFile;
  }

  // Update src file and name modal send
  function updateModalSend(srcFile,nameFile)
  {
    popupSend.querySelector("audio").src=srcFile;
    popupSend.querySelector(".name-recorded").innerHTML=nameFile;
  }

  // update icon response Status
  function updateIconSendStatus(row,newStatus)
  {
    // newStatus = accept | reject | waiting
    // row is div class item-status
    row.querySelector(".send-icon").src=UIPath[newStatus];
  }
  function updateIconResponseStatus(row,newStatus)
  {
    // row is div class item-status
    row.querySelector(".response-icon").src=UIPath[newStatus];
  }

  function resetState(){
    idle();
    unchecked();
    resetMsg();
    pauseAll();
  }
  return {
    toggleMic,
    openModal,
    closeModals,
    resetMsg,
    setMsgErrorTime,
    playSound,
    pauseSound,
    pauseAll,
    addStatus,
    addRecord,
    updateModalSrcFile,
    updateModalSend,
    updateIconSendStatus,
    updateIconResponseStatus,
    setupAll,
    addPerson,
    addListPeopleToSelect,
    setMsgErrorEmptySelect,
    genAudios,
    genDevices,
    genSchedules,
    updateOnlineStatus
  };
})();

const BtnController = (function () {

  function addEventListenerModalBtn(btn)
  {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("modalSendBtn")) {
        UIController.pauseAll();
        if(btn.innerHTML=="Send")
        {
          // from database
          setNameRecord(btn.previousElementSibling.querySelector(".name-recorded").innerHTML);
          setAudioID(btn.previousElementSibling.querySelector("audio").id);
          UIController.updateModalSend(btn.previousElementSibling.querySelector("audio").src,
                                      getNameRecord());
        }else {
          // from user
          setNameRecord(document.querySelector("#recordName").value);
          uploadAudio(getNameRecord(),audioBlobNow).then(response => {
            
            setAudioID(response.data["id"]);
            UIController.genAudios();

          });
          UIController.updateModalSend(AudioSrc,getNameRecord());

        }
        // if(btn.classList.contains("nameOK"))
        // {
        //    uploadAudio(getNameRecord(),audioBlobNow).then(response => {
        //       setAudioID(response.data["id"]);
        //    });
        // }else {
        //   ////////////////////////////////////
        //   // set audioID when click from recorded list
        //   //////////////////////////////////////

        // }
        UIController.openModal("modalSend");
        
      } else if (btn.classList.contains("modalName")) {
        UIController.pauseAll();
        isNewRecord=true;
        UIController.openModal("modalName");
      } else if (btn.classList.contains("closeBtn")) {
        isNewRecord=false;
        UIController.closeModals();
      }
    });
  }
  function addEventListenerSendBtn(btn)
  {
    btn.addEventListener("click", function () {
      
      if (!ValidityController.isValidTime()) {
        // Error
        UIController.setMsgErrorTime();
        return;
      }
      // Send Response
      
      // Create Schedule /////////
      ////////////////////////////
      let targets=[];
      let listPeople=document.querySelector("#listPeople").childNodes;
      listPeople.forEach( e =>{
        let chk=e.firstChild;
        if(chk.checked)
        {
          targets.push(chk.id);
        }
      })
      if(targets.length==0)
      {
        UIController.setMsgErrorEmptySelect();
        return;
      }
      const t = document.querySelector("#time").value;
      const d = document.querySelector("#date").value;
      const inputTime = new Date(`${t} ${d}`);
      
      createSchedule(getNameRecord(),inputTime,targets,getAudioID()).then(response =>{
        UIController.genSchedules();
        alert("Sent Successfully");
      });
      
      UIController.closeModals();
    });

  }
  function addEventListenerPlayBtn(btn)
  {
    btn.addEventListener("click",function (){
      if(btn.classList.contains("pause")===false)
      {
        UIController.playSound(btn);
        UIController.pauseAll(btn);
      }else {
        UIController.pauseSound(btn);
      }
  
    });
    
  }
  function addEventListenerAudio(btn)
  {
    btn.addEventListener("ended",function(){
      console.log("ended");
      UIController.pauseSound(btn.previousElementSibling);
    });

  }

  const modalBtn = document.querySelectorAll(".modalBtn");
  modalBtn.forEach((e) => {
    addEventListenerModalBtn(e);
  });

  const sendBtn = document.querySelectorAll(".sendBtn");
  sendBtn.forEach(function (btn) {
    addEventListenerSendBtn(btn);
  });

  const microphone = document.querySelector("#microphone");
  microphone.addEventListener("click",function(){
    UIController.pauseAll();
    UIController.toggleMic();
  });
  


  // play record
  const playButtons = document.querySelectorAll(".play-button");
  playButtons.forEach((e) => {
    addEventListenerPlayBtn(e);
  });

  const audioAll = document.querySelectorAll("audio");
  audioAll.forEach((e)=>{
    addEventListenerAudio(e);
  });


  const topic = document.querySelectorAll(".topic");
  const record = document.querySelector("#record");
  const online = document.querySelector("#online");
  const status = document.querySelector("#status");
  const recordTopic = document.querySelector("#record-topic");
  const onlineTopic = document.querySelector("#online-topic");
  const statusTopic = document.querySelector("#status-topic");
  
  
  topic.forEach((e)=>{
    e.addEventListener("click",function (){
      if(e.id=="record-topic")
      {
        record.classList.add("current");
        online.classList.remove("current");
        status.classList.remove("current");
        recordTopic.classList.add("current");
        onlineTopic.classList.remove("current");
        statusTopic.classList.remove("current");

      }else if(e.id=="online-topic")
      {
        record.classList.remove("current");
        online.classList.add("current");
        status.classList.remove("current");
        recordTopic.classList.remove("current");
        onlineTopic.classList.add("current");
        statusTopic.classList.remove("current");
      }else if(e.id=="status-topic")
      {
        record.classList.remove("current");
        online.classList.remove("current");
        status.classList.add("current");
        recordTopic.classList.remove("current");
        onlineTopic.classList.remove("current");
        statusTopic.classList.add("current");
      }
    })
  });


  return {
    addEventListenerModalBtn,
    addEventListenerPlayBtn,
    addEventListenerSendBtn,
    addEventListenerAudio
  };

})();



const ValidityController = (function () {
  function isValidTime() {
    const t = document.querySelector("#time").value;
    const d = document.querySelector("#date").value;
    const inputTime = new Date(`${t} ${d}`);
  
    return inputTime > Date.now();
  }
  
  return {
    isValidTime,
  };
})();


UIController.setupAll(); 