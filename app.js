function getRandomNumber(digits) {
  return Math.floor(Math.random() * digits);
}


// Genera un Array de numeros aleatorios del 0 al 10. Opcionalmente,
// se introduce un array de numeros que se desea que no aparezcan.
function getRandomNumbersArr(numbersLength, omittedNumbers = []) {
  let randomNumbers = [];
  for (let i = 0; i < numbersLength; i++) {
    let randomNumber = getRandomNumber(10);
    while (
      randomNumbers.indexOf(randomNumber) > -1 ||
      omittedNumbers.indexOf(randomNumber) > -1
    ) {
      randomNumber = getRandomNumber(10);
    }
    randomNumbers[i] = randomNumber;
  }
  return randomNumbers;
}

// Dados dos arrays de numeros a y b, introduce items del array b
// en posiciones aleatorias del array a.
function randomizePosition(numbersArray, numbersReplace, replaces) {
  let indexes = [];
  for (let i = 0; i < replaces; i++) {
    let index;
    do {
      index = getRandomNumber(numbersReplace.length);
    } while (indexes.indexOf(index) !== -1);
    indexes.push(index);
    numbersArray[indexes[i] > 1 ? Math.floor(indexes[i] / 2) : indexes[i] + 1] =
      numbersReplace[indexes[i]];
  }
  return numbersArray;
}

function loadHints(secretCode) {
  //  Se crean dos listas de numeros no iguales a los del codigo secreto.
  let wrongNumbers1 = getRandomNumbersArr(secretCode.length, secretCode);
  let wrongNumbers2 = getRandomNumbersArr(secretCode.length, secretCode);

  // 1a pista: Se usa una copia de dicha lista para introducirle un numero
  // del codigo secreto elegido aleatoriamente en la posicion correcta.
  let firstHint = wrongNumbers1.slice();
  let firstHintIndex = getRandomNumber(secretCode.length);
  firstHint[firstHintIndex] = secretCode[firstHintIndex];

  // 2a pista: Se usa una copia de dicha lista para introducirle un numero
  // del codigo secreto elegido aleatoriamente en la posicion incorrecta.
  let secondHint = randomizePosition(wrongNumbers1.slice(), secretCode, 1);

  // 3a pista: Se usa una copia de dicha lista para introducirle dos numeros
  // del codigo secreto elegidos aleatoriamente en la posicion incorrecta.
  let thirdHint = randomizePosition(wrongNumbers1.slice(), secretCode, 2);

  // 4a pista: Se usa una copia de dicha lista, que ya es distinta al codigo secreto
  // y por lo tanto incorrecta.
  let fourthHint = wrongNumbers1;

  // 5a pista: Lo mismo que en la 2a pista.
  let fiftHint = randomizePosition(wrongNumbers1.slice(), secretCode, 1);

  console.log(
    "Psst! El codigo secreto es:",
    secretCode,
    ", no le digas a nadie."
  );

  // Contenedor de pistas (Array) (JS)
  const HINTS = [firstHint, secondHint, thirdHint, fourthHint, fiftHint];

  // Contenedor de pistas en el DOM (HTML)
  let hintSections = document.getElementsByClassName("pistas");

  // Comprueba si las pistas contienen todo lo necesario para descifrar el codigo,
  // si lo tienen, pone las pistas a la vista del usuario,
  // si no lo tienen, llama a la funcion nuevamente, generando nuevas pistas.
  if (secretCode.every((element) => HINTS.flat().includes(element))) {
    for (let i = 0; i < hintSections.length; i++) {
      for (let j = 0; j < secretCode.length; j++) {
        hintSections[i].innerHTML += `<p class="col-3 numeros">${HINTS[i][j]}</p>`;
      }
    }
  } else {
    loadHints(secretCode);
  }
}

var secure_secretCode = getRandomNumbersArr(3);

let guessForm = document.getElementById("user-guess");

let textAreas = guessForm.getElementsByTagName("textarea");

for (let i = 0; i < textAreas.length; i++) {
  textAreas[i].addEventListener("keyup", (event) => {
    let keyPressed = event.key;
    if (keyPressed == "Backspace" || keyPressed == "ArrowRight") {
      event.target.previousElementSibling.focus();
    } else {
      event.target.nextElementSibling.focus();
    }
  });
}

document.getElementById("submit-guess-btn").addEventListener("keydown", (event) => {
  if(event.key == "Enter") {
    document.getElementById("user-guess").submit();
  }
})

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let form = event.target;
  let guess = [];
  for (let i = 0; i < form.elements.length - 1; i++) {
    let num = form.elements[i].value ? Number(form.elements[i].value) : -1;
    if (!isNaN(num)) {
      guess.push(num);
    }
  }
  let loseAnnouncement = document.getElementById("lose-announcement");
  if (!guess.some((value) => value === -1) && guess.length === secure_secretCode.length) {
    if (guess.every((value, index) => value == secure_secretCode[index])) {
      window.location.replace("good_ending.html");
    } 
    else {
      loseAnnouncement.innerHTML = `<p style="font-size: 1.3rem; padding: 5% 0 4%;" class="col-12 text-center">Ups, ${guess.join("")} no era el codigo correcto. Buen intento!</p>`;
    }
  } else {
    loseAnnouncement.innerHTML = `<p style="font-size: 1.3rem; padding: 5% 0 4%;" class="col-12 text-center">Asegúrate de introducir un código con formato válido. El código solo debe contener números y no tener espacios vacios.</p> `;
  }
});

loadHints(secure_secretCode);