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
  };

  function toggleMic() {
    const mic = document.querySelector(UISelector.microphone);
    if (
      colorVariable.convertRGBtoHex(mic.style.backgroundColor) !==
      colorVariable.redLight
    ) {
      mic.style.backgroundColor = colorVariable.redLight;
      return;
    }
    mic.style.backgroundColor = colorVariable.primary;
  }

  function openModal(modalReference) {
    document.querySelector(UISelector[modalReference]).style.display = "block";
  }

  function closeModals() {
    document.querySelector(UISelector.modalName).style.display = "none";
    document.querySelector(UISelector.modalSend).style.display = "none";
  }

  return {
    toggleMic,
    openModal,
    closeModals,
  };
})();

const BtnController = (function () {
  const modalBtn = document.querySelectorAll(".modalBtn");
  modalBtn.forEach((e) => {
    e.addEventListener("click", function () {
      if (e.classList.contains("modalSendBtn")) {
        UIController.openModal("modalSend");
      } else if (e.classList.contains("modalName")) {
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
        return;
      }
      UIController.closeModals();
      // Send Response
    });
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
