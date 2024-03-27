
///////////////////
//// VARIABLES ////
///////////////////

const musiques = document.querySelectorAll(".musique");

const audioList = document.querySelectorAll("audio");

const trackTime = document.querySelector("#track-time");
const trackTimeList = document.querySelectorAll(".track-time");

const trackBar = document.querySelector("#track");
const elapsed = document.querySelector("#elapsed");

const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const repeatButton = document.querySelector("#repeat-button");
const randomButton = document.querySelector("#random-button");
const backwardButton = document.querySelector("#backward-button");
const forwardButton = document.querySelector("#forward-button");

const volume = document.querySelector("#volume");
const volumeOn = document.querySelector("#volume-on");
const volumeOff = document.querySelector("#volume-off");

///////////////////
//// FONCTIONS ////
///////////////////

function buildDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function stopAudio(){
    audio.pause(); 
    audio.currentTime = 0;
    playButtonVisible();
}

function changeAudio(index) {
    stopAudio();
    audio = audioList[index];
    audio.play(); 
    audio.volume = volume.value;
    currentAudioIndex = index;

    console.log(audio);
}

function musicStyle(element, index) {
    if (currentAudioIndex !== index) {
        changeAudio(index);
    } else {
        audio.play()
    }

    pauseButtonVisible()

    // Réinitialisez les styles de tous les éléments de musique
    for (let i = 0; i < musiques.length; i++) {
        musiques[i].style = "";
      }

    // Définissez les styles pour l'élément actuel
    element.style.background = "rgba(0, 0, 0, 0.2)";
    element.style.color = "#ffe664";
    element.style.fontWeight = "700";
}

function updateProgressBar(audio) {
    requestAnimationFrame(function update() {
        trackBar.value = (audio.currentTime / audio.duration) * 100;
        elapsed.textContent = buildDuration(audio.currentTime);
        trackBar.style.background = `linear-gradient(to right, rgba(255,193,83,1) 0%, rgba(255,230,100,1) ${trackBar.value}%, #808080 ${trackBar.value}%, #808080 100%)`;
        
        if (!audio.paused) {
            requestAnimationFrame(update);
        }
    });
}

function getRandomIndex(currentIndex) {
    let randomIndex = currentIndex;
    while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * audioList.length);
    }
    return randomIndex;
}

function playButtonVisible() {
    pauseButton.style.display = "none";
    playButton.style.display = "initial";
}

function pauseButtonVisible() {
    pauseButton.style.display = "initial";
    playButton.style.display = "none";
}

///////////////////
//// MUSIQUES /////
///////////////////

let currentAudioIndex = 0;
let audio = audioList[currentAudioIndex];

// Paramètres au chargement de la page
musiques[0].style.background = "rgba(0, 0, 0, 0.2)";
musiques[0].style.color = "#ffe664";
musiques[0].style.fontWeight = "700";

trackTime.textContent = buildDuration(audio.duration)
for (let i = 0; i < trackTimeList.length; i++) {
    trackTimeList[i].textContent = buildDuration(audioList[i].duration);
  }

// Clics musiques 
musiques.forEach((element, index) => {
    element.addEventListener("click", function() {
        musicStyle(element, index);
        trackTime.textContent = buildDuration(audioList[index].duration);
    });
});

///////////////////
////// COEUR //////
///////////////////

audioList.forEach((audio, index) => {
    audio.addEventListener("timeupdate", function() {
        updateProgressBar(this);
    });
    audio.addEventListener("ended", function() {
        
        if (repeatButtonClicked == 2) {
            audio.play();
            
        } else if (repeatButtonClicked == 1) {

            if (randomMode) {
                if (playedIndices.length == 0) {
                    playedIndices.push(currentAudioIndex);
                };
                
                if (playedIndices.length === audioList.length) {
                    playedIndices = [];
                };
        
                // Sélectionnez un index aléatoire qui n'a pas encore été joué
                let nextIndex;
                do {
                    nextIndex = getRandomIndex(currentAudioIndex);
                } while (playedIndices.includes(nextIndex));
                
                // Ajoutez l'index actuel à la liste des indices joués
                playedIndices.push(nextIndex);
        
                musicStyle(musiques[nextIndex], nextIndex);
        
                // Mettez à jour la durée de la piste suivante
                trackTime.textContent = buildDuration(audioList[nextIndex].duration);
        
                console.log(playedIndices);

            } else {
                const nextIndex = (currentAudioIndex + 1) % audioList.length;
                musicStyle(musiques[nextIndex], nextIndex);
                trackTime.textContent = buildDuration(audioList[nextIndex].duration);
            }
            
        } else {
            if (randomMode) {
                if (playedIndices.length == 0) {
                    playedIndices.push(currentAudioIndex);
                };

                if (playedIndices.length === audioList.length) {
                    playedIndices = [];
                    musicStyle(musiques[0], 0);
                    trackTime.textContent = buildDuration(audioList[0].duration);
                    stopAudio();
                } else {
                    let nextIndex;
                    do {
                        nextIndex = getRandomIndex(currentAudioIndex);
                    } while (playedIndices.includes(nextIndex));
                    
                    // Ajoutez l'index actuel à la liste des indices joués
                    playedIndices.push(nextIndex);
            
                    musicStyle(musiques[nextIndex], nextIndex);
            
                    // Mettez à jour la durée de la piste suivante
                    trackTime.textContent = buildDuration(audioList[nextIndex].duration);
    
                    console.log(playedIndices);
                }

            } else {
                if (currentAudioIndex == musiques.length - 1) {
                    musicStyle(musiques[0], 0);
                    trackTime.textContent = buildDuration(audioList[0].duration);
                    stopAudio();

                } else {
                    const nextIndex = (currentAudioIndex + 1) % audioList.length;
                    musicStyle(musiques[nextIndex], nextIndex);
                    trackTime.textContent = buildDuration(audioList[nextIndex].duration);
                }
            }
        }
    });
});

///////////////////
/// BARRE AUDIO ///
///////////////////

trackBar.addEventListener("input", function(){
    const newTime = (this.value / 100) * audio.duration; // Convertit la position en pourcentage en temps en secondes
    audio.currentTime = newTime;
    elapsed.textContent = buildDuration(newTime);
});

trackBar.addEventListener("click", function(event) {
    const clickX = event.clientX - this.getBoundingClientRect().left; // Récupérer la position horizontale du clic par rapport au bord gauche de la barre de progression
    const percentClicked = (clickX / this.offsetWidth) * 100; // Calculer le pourcentage cliqué en fonction de la position du clic et de la largeur totale de la barre
    const newTime = (percentClicked / 100) * audio.duration;
    audio.currentTime = newTime;
});

///////////////////
///// BOUTONS /////
///////////////////

//  Bouton play

playButton.addEventListener("click", function(){
    audio.play();
    audio.volume = volume.value;
    pauseButtonVisible();
});

// Bouton pause

pauseButton.addEventListener("click", function(){
    audio.pause();
    playButtonVisible();
});

// Bouton backward

let lastBackwardClickTime = 0;

backwardButton.addEventListener("click", function(){
    backwardButton.style.fill = "#ffe664";
    setTimeout(function() {
        backwardButton.style.fill = "";
    }, 150);
    audio.currentTime = 0;

    const currentTime = new Date().getTime();

    // Vérifiez si la différence entre le dernier clic et le clic actuel est inférieure à 2000 ms (2 secondes)
    if (currentTime - lastBackwardClickTime < 2000) {
        // Revenir à la piste précédente si disponible

        if (randomMode) {
            if (playedIndices.length <= 1) {
                previousIndex = (currentAudioIndex - 1 + audioList.length) % audioList.length;
                musicStyle(musiques[previousIndex], previousIndex);
                trackTime.textContent = buildDuration(audioList[previousIndex].duration);
            } else {
                playedIndices.pop();
                const previousIndex = playedIndices[playedIndices.length - 1];
                musicStyle(musiques[previousIndex], previousIndex);
                trackTime.textContent = buildDuration(audioList[previousIndex].duration);
            }
            console.log(playedIndices);
        } else {
            const previousIndex = (currentAudioIndex - 1 + audioList.length) % audioList.length;
            musicStyle(musiques[previousIndex], previousIndex);
            trackTime.textContent = buildDuration(audioList[previousIndex].duration);
        }
        
    } else {
        // Sinon, remettez simplement la musique au début
        audio.currentTime = 0;
    }

    // Mettez à jour le dernier clic
    lastBackwardClickTime = currentTime;
});

// Bouton forward
let playedIndices = [];

forwardButton.addEventListener("click", function(){
    forwardButton.style.fill = "#ffe664";
    setTimeout(function() {
        forwardButton.style.fill = "";
    }, 150);

    if (randomMode) {
        
        if (playedIndices.length == 0) {
            playedIndices.push(currentAudioIndex);
        };
        
        // S'il ne reste plus aucune musique à jouer en mode aléatoire,
        // réinitialisez la liste des indices joués.
        if (playedIndices.length === audioList.length) {
            playedIndices = [];
        };

        // Sélectionnez un index aléatoire qui n'a pas encore été joué
        let nextIndex;
        do {
            nextIndex = getRandomIndex(currentAudioIndex);
        } while (playedIndices.includes(nextIndex));
        
        // Ajoutez l'index actuel à la liste des indices joués
        playedIndices.push(nextIndex);

        musicStyle(musiques[nextIndex], nextIndex);

        // Mettez à jour la durée de la piste suivante
        trackTime.textContent = buildDuration(audioList[nextIndex].duration);

        console.log(playedIndices);
        
    } else {

        // Mode non aléatoire : passez simplement à la piste suivante
        const nextIndex = (currentAudioIndex + 1) % audioList.length;
        musicStyle(musiques[nextIndex], nextIndex);

        // Mettez à jour la durée de la piste suivante
        trackTime.textContent = buildDuration(audioList[nextIndex].duration);
    }
});

// Bouton random

let randomMode = false;

randomButton.addEventListener("click", function() {
    if (randomMode) {
        this.style.fill = ""; // Désactivez le mode aléatoire
    } else {
        this.style.fill = "#ffe664";
        playedIndices = [];
    }
    randomMode = !randomMode;
});

// Bouton repeat

let repeatButtonClicked = 0;

repeatButton.addEventListener("click", function() {
    if (repeatButtonClicked == 0) {
        this.style.fill = "#ffe664";
        repeatButtonClicked = 1;
    } else if (repeatButtonClicked == 1) {
        this.style.fill = "white";
        repeatButtonClicked = 2;
    } else {
        this.style.fill = "";
        repeatButtonClicked = 0;
    }
});

///////////////////
///// VOLUME //////
///////////////////

// Curseur du volume 

volume.addEventListener("input", function(){
    audio.volume = this.value;
    if (this.value === "0") {
        volumeOn.style.display = "none";
        volumeOff.style.display = "initial";
    } else {
        volumeOn.style.display = "initial";
        volumeOff.style.display = "none";
    }
    if (audio.muted) {
        audio.muted = false;
        volumeOn.style.display = "initial";
        volumeOff.style.display = "none";
    }
    volume.style.background = "linear-gradient(90deg, rgba(103, 0, 109, 1) 0%, rgba(88, 1, 169, 1) 100%)";
})

// Bouton mute/demute

volumeOn.addEventListener("click", function() {
    audio.muted = true;
    volume.value = 0;
    volumeOn.style.display = "none";
    volumeOff.style.display = "initial";
});

volumeOff.addEventListener("click", function() {
    audio.muted = false;
    audio.volume = 0.5;
    volume.value = audio.volume;
    volumeOn.style.display = "initial";
    volumeOff.style.display = "none";
});

