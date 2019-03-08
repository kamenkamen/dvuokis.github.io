// get cursor position
let cursorX;
let cursorY;
document.onmousemove = function (e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
};

let currentWeapon = 'pistol';
let kills = 0;

function game() {
    // DOM elements
    let bodyElement = document.getElementsByTagName("BODY")[0];
    let areaElement = document.querySelector('.area');
    let bullets = document.querySelector('.bullets p');
    let bombs = document.querySelector('.bombs p');

    // load functions
    hideScrollBars();
    setInterval(changeGunPosition, 100);
    setInterval(backgroundSound, 7 * 1000);

    // welcome screen
    document.addEventListener('keyup', welcomeScreenEvent);

    // change weapon
    document.addEventListener('keyup', function (event) {
        if ('Digit1' === event.code) {
            setNewWeapon('pistol');
        } else if ('Digit2' === event.code) {
            setNewWeapon('rifle');
        } else if ('Digit3' === event.code) {
            setNewWeapon('banana');
        } else if ('Digit4' === event.code) {
            dropNukeBomb();
        }
    });

    // on shoot with left mouse
    document.addEventListener('click', function () {
        if ('pistol' === currentWeapon) {
            bullets.textContent -= 1; // remove one bullet on shot with pistol
            playAudio('./sounds/gun-sound.wav');
        } else if ('rifle' === currentWeapon) {
            bullets.textContent -= 5; // remove 5 bullets on shot with AK-47
            playAudio('./sounds/rifle-sound.wav');
        } else if ('banana' === currentWeapon) {
            bullets.textContent = parseInt(bullets.textContent) + 50; // set GOD_mode with banana
            playAudio('./sounds/banana-sound.wav');
        }

        onShotDropElement();
    });
}

function welcomeScreenEvent(event) {
    let startElement = document.querySelector('.start');
    let gameSpeed = 700;

    if ('Enter' === event.code) {
        startElement.classList.add('hide'); // hide welcome menu
        playAudio('./sounds/start-sound.mp3'); // play start sound
        setInterval(generateElementsForDrops, gameSpeed); // start generate elements for drops
        document.removeEventListener('keyup', welcomeScreenEvent); // remove event listener for Enter button
        let dinko = document.querySelector('.dinko');
        dinko.style.display = 'none'; // hide Dinko
    }
}

function playAudio(soundPath) {
    var audio = new Audio(soundPath);
    audio.play();
}

function hideScrollBars() {
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
}

function changeGunPosition() {
    // change gun position on moving mouse
    let gunElement = document.querySelector('.gun');
    gunElement.style.marginLeft = cursorX + 'px';
}

function backgroundSound() {
    playAudio('./sounds/background-sound.wav');
}

function dropNukeBomb() {
    let bodyElement = document.getElementsByTagName("BODY")[0];
    playAudio('./sounds/bomb-sound.wav');

    setTimeout(function () {
        bodyElement.style.opacity = 0;
    }, 3100);

    setTimeout(function () {
        let killsElement = document.querySelector('.kills p');
        let countParachutesOnScreen = document.querySelectorAll('.drop-element').length; // all parachutes in div dropElements

        killsElement.textContent = parseInt(killsElement.textContent) + countParachutesOnScreen; // add killed parachutes into kills;

        let dropElementsDiv = document.querySelector('.drop-elements');
        dropElementsDiv.textContent = ''; // remove all elements on screen

        bodyElement.style.opacity = 1;
    }, 7000);

    let bombs = document.querySelector('.bombs p');
    bombs.textContent -= 1;
}

function setNewWeapon(weaponName) {
    let gunElement = document.querySelector('.gun');

    gunElement.innerHTML = ''; // clear previous weapon
    let rifleElement = document.createElement('div'); // create div for pistol
    rifleElement.classList.add(weaponName); // add class .pistol
    currentWeapon = weaponName;
    gunElement.appendChild(rifleElement);
}

function generateElementsForDrops() {
    let marginLeft = 10;
    let marginRight = 70;
    let randomWidthForNewElement = Math.floor(Math.random() * (screen.width - marginRight)) + marginLeft;

    let parachute = document.createElement('div');
    parachute.classList.add('parachute');
    let tomcat = document.createElement('div');
    tomcat.classList.add('tomcat');

    let dropElement = document.createElement('div');
    dropElement.classList.add('drop-element');
    dropElement.style.left = randomWidthForNewElement + 'px';
    dropElement.appendChild(parachute);
    dropElement.appendChild(tomcat);

    let dropElements = document.querySelector('.drop-elements');
    dropElements.appendChild(dropElement);

    moveDownElements();
}

function moveDownElements() {
    let dropElements = document.querySelectorAll('.drop-element');

    for (const element of dropElements) {
        let position = element.style.top;
        let id = setInterval(frame, 10);

        function frame() {
            if (position === screen.height - 200) {
                element.remove(); // remove element if drop down
                clearInterval(id);
            } else {
                position++;
                element.style.top = position + 'px';
            }
        }
    }
}

function onShotDropElement() {
    let dropElements = document.querySelectorAll('.drop-element');
    let killsElement = document.querySelector('.kills p');

    for (const element of dropElements) {
        element.addEventListener('click', function (event) {
            element.remove();
            kills++;
            killsElement.textContent = kills;
        });
    }
}