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
    pauseSvg: "/resource/pause.svg",
    playSvg: "/resource/play-button.svg", 
  };
  
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
      mic.style.backgroundColor = colorVariable.redLight;
      textMicrophone.innerHTML = "Recording\.\.\.<br>click again to finish";
      
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
    msg.innerHTML="--- Invalid Time&Data ---";
    msg.classList.add("error");
  }

  // Play Pause
  function playSound(e)
  {
    e.classList.add("pause");
    e.src=UISelector.pauseSvg;
    e.nextElementSibling.play()
  }
  function pauseSound(e)
  {
    e.classList.remove("pause");
    e.src=UISelector.playSvg;
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
    pauseAll
  };
})();

const BtnController = (function () {
  const modalBtn = document.querySelectorAll(".modalBtn");
  modalBtn.forEach((e) => {
    e.addEventListener("click", function () {
      if (e.classList.contains("modalSendBtn")) {
        UIController.pauseAll();
        UIController.openModal("modalSend");
      } else if (e.classList.contains("modalName")) {
        UIController.pauseAll();
        UIController.openModal("modalName");
      } else if (e.classList.contains("closeBtn")) {
        UIController.closeModals();
      }
    });
  });

  const sendBtn = document.querySelectorAll(".sendBtn");
  sendBtn.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const t = document.querySelector("#time").value;
      const d = document.querySelector("#date").value;

      if (!ValidityController.isValidTime(`${t} ${d}`)) {
        // Error
        UIController.setMsgErrorTime();
        return;
      }
      UIController.closeModals();
      // Send Response
    });
  });

  const microphone = document.querySelector("#microphone");
  microphone.addEventListener("click",function(){
    UIController.pauseAll();
    UIController.toggleMic();
  });
  


  // play record
  const playButtons = document.querySelectorAll(".play-button");
  playButtons.forEach((e) => {
    e.addEventListener("click",function (){
      if(e.classList.contains("pause")===false)
      {
        UIController.playSound(e);
        UIController.pauseAll(e);
      }else {
        UIController.pauseSound(e);
      }

    });
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

  


})();



const ValidityController = (function () {
  function isValidTime(time) {
    const inputTime = new Date(time);

    return inputTime > Date.now();
  }
  return {
    isValidTime,
  };
})();

