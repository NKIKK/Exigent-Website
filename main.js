const modalBtn = document.querySelectorAll('.modalBtn');
const closeBtn = document.querySelectorAll('.closeBtn');
const microphone = document.querySelector('#microphone');
const modalName = document.querySelector('#popupName');
const modalSend = document.querySelector('#popupSend');
// modalBtn.addEventListener('click',openModal);
// function openModal(){
//   modal.style.display = "block";
// }

// closeBtn.addEventListener('click',closeModal);
// function closeModal(){
//   modal.style.display="none";
// }
modalBtn.forEach(e => {
  e.addEventListener('click',function (){
      if(e.classList.contains('modalSendBtn'))
      {
        modalSend.style.display = "block";

      }
      else if(e.classList.contains('modalName'))
      {
        modalName.style.display="block";

      }
      else if(e.classList.contains('closeNameBtn'))
      {
        modalName.style.display="none";

      }
      else if(e.classList.contains('closeSendBtn'))
      {
        modalSend.style.display="none";

      }// else if(e.classList.contains('idle'))
      // {
      //   microphone.classList.replace('idle','recording');
      //   microphone.nextSibling.textContent="Recording\.\.\.
      //   click again to finish";
      // }
     });
});


console.log(modalName);