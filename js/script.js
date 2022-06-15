/*L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49
Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
I numeri nella lista delle bombe non possono essere duplicati.
In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
BONUS:
1- quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
2- quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste*/

/******************** 
* FASE PREPARATORIA *
*********************/
// [1] SE sceglie il livello 
    // 1 : le celle comprenderanno i numeri da 1 a 100
    // 2 : le celle comprenderanno i numeri da 1 a 81
    // 3 : le celle comprenderanno i numeri da 1 a 49
// [2] genero 16 numeri casuali (senza duplicati), che rappresenteranno le bombe, per un range che va da 1 a levelMaxRange (100-81-49)
// [3] mi calcolo il numero massimo di tentativi che l'utente può fare: maxAttempts = levelMaxRange - bombs (numero di bombe, cioé 16)
// [4] in base al livello scelto dall'utente genero una griglia quadrata, cui ogni cella contiene un numero compreso nel range del livello

/******************** 
*    FASE LOGICA    *
*********************/
// il gioco inizia quando l'utente clicca sul button 'play'
// FINCHE' il gioco non finisce
    // [1] l'utente clicca su una cella
    // [2.1] SE il numero è presente in quelli generati casualmente (è una bomba) -> la casella si colora di rosso -> l'utente perde -> faccio finire il gioco + comunico all'utente il punteggio
    // [2.2] ALTRIMENTI (la casella si colora di azzurro)
        // SE (il numero non è presente in quelli già dati dall'utente) lo pusho nell'array userNumbers
        // SE l'utente ha raggiunto il numero massimo di tentativi possibili -> l'utente vince -> faccio finire il gioco + gli comunico che ha vinto + punteggio

// il gioco inizia quando l'utente clicca sul button 'play'
const playBtn = document.querySelector('#play');
playBtn.addEventListener('click', startGame);

function startGame() {
    //HTML elements
    const mainGrid = document.querySelector('#main-grid');

    // svuoto la griglia e tolgo le classi ogni volta che l'utente inizia una nuova partita
    mainGrid.innerHTML = '';
    mainGrid.className = '';

    // visioniamo il livello scelto dall'utente tramite il select nel dom
    const userLevel = parseInt(document.querySelector('#user-level').value);
    console.log(userLevel);

    //[1] SE sceglie il livello 
        // 1 le celle comprenderanno i numeri da 1 a 100
        // 2 : le celle comprenderanno i numeri da 1 a 81
        // 3 : le celle comprenderanno i numeri da 1 a 49
    let levelMaxRange;
    let mainGridClass;
    switch (userLevel) {
        case 1:
            levelMaxRange = 100;
            mainGridClass = 'easy';
            break;
        case 2:
            levelMaxRange = 81;
            mainGridClass = 'hard';
            break;
        case 3:
            levelMaxRange = 49;
            mainGridClass = 'crazy';
            break;
    }
    // console.log(levelMaxRange);

    // [2] genero 16 numeri casuali (senza duplicati), che rappresenteranno le bombe, per un range che va da 1 a levelMaxRange (100-81-49)
    const totalNumberOfBombs = 16;
    const bombs = generateBombs(totalNumberOfBombs, 1, levelMaxRange);
    console.log('bombe', bombs);

    // [3] mi calcolo il numero massimo di tentativi che l'utente può fare: maxAttempts = levelMaxRange - bombs (numero di bombe, cioé 16)
    const maxAttempts = levelMaxRange - totalNumberOfBombs;
    console.log('tentativi', maxAttempts);

    // [4] in base al livello scelto dall'utente genero una griglia quadrata, cui ogni cella contiene un numero compreso nel range del livello
    generateGrid();

    /******************** 
    *   DOM FUNCTIONS   *
    *********************/
    // FUNZIONE PER GENERARE LA GRIGLIA
    function generateGrid() {
        //dare una classe alla griglia che decide le dimensioni delle celle
        mainGrid.classList.add(mainGridClass);

        for( let i = 1; i <= levelMaxRange; i++) {
            //creare una cella: <div class="square"><span></span></div>
            const newCell = document.createElement('div');
            newCell.innerHTML = `<span>${i}</span>`;
            newCell.classList.add('square');

            // aggiungere cosa succede al click
            newCell.addEventListener('click', manageCellClick);
    
            //aggiungo un testo e una classe che fa cambiare colore alle celle
            mainGrid.append(newCell);
        }
    }

    const userNumbers = [];
    let userMessage = document.getElementById('user-message');
        
    // FUNZIONE PER CAMBIARE COLORE ALLE CELLE
    function manageCellClick() {
    
        // [1] l'utente clicca su una cella    
        let userNumber = parseInt(this.querySelector('span').innerHTML);

        // [2.1] SE il numero è presente in quelli generati casualmente (è una bomba) -> la casella si colora di rosso -> l'utente perde -> faccio finire il gioco + comunico all'utente il punteggio
        if(bombs.includes(userNumber)) {
            this.classList.add('red');
            userMessage.innerHTML = `hai perso!! sei finito su una bomba! :( i tuoi tentativi sono stati: ${userNumbers}`; 
        } else {
            // SE (il numero non è presente in quelli già dati dall'utente) lo pusho nell'array userNumbers
            if (!userNumbers.includes(userNumber)) {
                userNumbers.push(userNumber);
                this.classList.add('blue');

            }
            console.log(userNumbers);
    
            // SE l'utente ha raggiunto il numero massimo di tentativi possibili -> l'utente vince -> faccio finire il gioco + gli comunico che ha vinto + punteggio
            if (userNumbers.length === maxAttempts) {
                userMessage.innerHTML = `hai vinto!! hai scansato tutte le bombe! i tuoi tentativi sono stati: ${userNumbers}`
            }
        }

        this.style.pointerEvents = 'none';
    }
}

/******************** 
* UTILITY FUNCTIONS *
*********************/
/* FUNZIONE PER GENERARE NUMERO RANDOM */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/* FUNZIONE PER GENERARE LE BOMBE */
// genero un array di n elementi (numeri random)
// numberOfBombs -> numero di bombe che devono essere presenti nell'array (16)
// rangeMin -> range minimo dei numeri random da generare
// rangeMax -> range massimo dei numeri random da generare
// return: array di numeri random con .length < numberOfBombs

function generateBombs (numberOfBombs, rangeMin, rangeMax) {

    // console.log('numero elementi dell\'array', numberOfBombs);
    // console.log('range minimo', rangeMin);
    // console.log('range massimo', rangeMax);

    const randomNumberBombs = [];

    while(randomNumberBombs.length < numberOfBombs) {

        //genero un numero random da rangeMin (1) a rangeMax (che varia in base al livello scelto dall'utente)
        const randomNumber = getRndInteger(rangeMin, rangeMax);

        //pushiamo il numero nell'array solo se non è già presente
        if(!randomNumberBombs.includes(randomNumber)) {
            randomNumberBombs.push(randomNumber);
        }
    }

    return randomNumberBombs;
}