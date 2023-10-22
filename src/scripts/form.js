function openForm() {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("myFormHeader").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("myFormHeader").style.display = "none";
}

let currentTab = 0;
showTab(currentTab);

function showTab(n) {

  let x = document.getElementsByClassName("tab");
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[n].style.display = "block";

  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "SEND";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next step";
  }
}

function validateFirstStep() {
  let projectOptions = document.querySelectorAll('input[name="your_project"]');
  let glassRodOptions = document.querySelectorAll('input[name="glass_or_rod"]');
  let installPriceOptions = document.querySelectorAll('input[name="install_or_price"]');
  let valid = false;

  for (let option of projectOptions) {
    if (option.checked) {
      valid = true;
      break;
    }
  }

  if (!valid) {
    document.getElementById("error-message").style.display = "block";
    setTimeout(function () {
      document.getElementById("error-message").style.display = "none";
    }, 3000);
    return false;
  }

  valid = false;
  for (let option of glassRodOptions) {
    if (option.checked) {
      valid = true;
      break;
    }
  }

  if (!valid) {
    document.getElementById("error-message").style.display = "block";
    setTimeout(function () {
      document.getElementById("error-message").style.display = "none";
    }, 3000);
    return false;
  }

  valid = false;
  for (let option of installPriceOptions) {
    if (option.checked) {
      valid = true;
      break;
    }
  }

  if (!valid) {
    document.getElementById("error-message").style.display = "block";
    setTimeout(function () {
      document.getElementById("error-message").style.display = "none";
    }, 3000); 
    return false;
  }

  return true;
}

function nextPrev(n) {
  if (currentTab === 0 && n === 1) {
    if (!validateFirstStep()) return false;
  }

  let x = document.getElementsByClassName("tab");
  if (n == 1 && !validateForm()) return false;
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= x.length) {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";

  const submitPopup = document.getElementById("success-message");
  submitPopup.style.display = "block";
  setTimeout(function() {
    submitPopup.style.display = "none";
    submitFormToServer();
    document.getElementById("regForm").submit();
  }, 3000);
    return false;
  }

  showTab(currentTab);
}

function submitFormToServer() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbw1FG3f_-Y1sb_6RTqcVMDSfcvDr4wqz2ABEdTtfUj0zZ1j00hiCQ6QxB_DOGHSlQTOiw/exec';
  const form = document.forms['submit-to-google-sheet'];
  const errorText = document.getElementById('sendText')

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      closeForm()
      form.reset()
    })
    .catch(error => {
      errorText.innerHTML = "Something went wrong, sorry. Try again later"
          setTimeout(function(){
            sendText.innerHTML = ""
        }, 3000)
        document.getElementById("regForm").submit()
    });
}

function validateForm() {
  let x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");

  let errorMessages = [];
  let errorIndex = 0;

  for (i = 0; i < y.length; i++) {
    if (y[i].value === "") {
      y[i].className += " invalid";
      valid = false;
    } else {
      y[i].classList.remove("invalid");
    }

    if (y[i].name === "name" && y[i].value === "") {
      errorMessages.push("Fill your name, please!");
    } else if (y[i].type === "email" && !isValidEmail(y[i].value)) {
      errorMessages.push("Fill the correct e-mail, please!");
      valid = false;
    } else if (y[i].type === "tel" && !isValidPhoneNumber(y[i].value)) {
      errorMessages.push("Fill the correct phone number, please!");
      valid = false;
    } else if (y[i].name === "zipCode" && !isValidZIPCode(y[i].value)) {
      errorMessages.push("Fill the correct ZIP code, please!");
      valid = false;
    }
  }

  function showNextErrorMessage() {
    if (errorMessages.length > errorIndex) {
      showMessage(errorMessages[errorIndex]);
      errorIndex++;
    } 
  }

  if (!valid) {
    showNextErrorMessage();
  }

  return valid;
}

function showMessage(message) {
  const popup = document.getElementById("popup");
  popup.innerText = message;
  popup.style.display = "block";

  setTimeout(function() {
    popup.style.display = "none";
  }, 1500);
}

function isValidEmail(email) {
  const emailPattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  return emailPattern.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  const phonePattern = /^\+1 \(\d{3}\) \d{3}-\d{4}$/;
  return phonePattern.test(phoneNumber);
}

function isValidZIPCode(zipCode) {
  const zipCodePattern = /^\d{5}$/;
  return zipCodePattern.test(zipCode);
}
