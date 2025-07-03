const canvas = document.getElementById('meinCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 20; 
canvas.height = window.innerHeight - 20;



class Wahl {
    constructor() {
        this.bezeichnung = "name";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 0.0;
        this.stimmenanzahl = 1;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        this.vorschlaege = [];
    }
}

class WahlPlatzhalter1 {
    constructor() {
        this.bezeichnung = "Platzhalter 1";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 0.0;
        this.stimmenanzahl = 1;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        this.vorschlaege = [];
    }
}

class WahlPlatzhalter2 {
    constructor() {
        this.bezeichnung = "Platzhalter 2";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 0.0;
        this.stimmenanzahl = 1;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        this.vorschlaege = [];
    }
}

class WahlDurchschnittsplatz {
    constructor() {
        this.bezeichnung = "Durchschnittsplatzierung";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 0.0;
        this.stimmenanzahl = 1;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        let min = 1000000;
        let gesamt = 0;
        for (const v of this.vorschlaege) {
            this.stimmenanzahl = v.bewertungen.length;
            let zaehler = 0;
            for (const b of v.bewertungen) {
                zaehler += b;                
            }
            gesamt += zaehler;
            v.zaehler = zaehler;
            min = Math.min(min, v.zaehler);
        }
        this.reihenfolge = this.vorschlaege.filter(v => v.zaehler === min);
        this.stimmenanteil = (gesamt - min) / gesamt * 100;
    }
}

class WahlKeineChance {
    constructor() {
        this.bezeichnung = "Negativer Konsens";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 100.0;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        this.reihenfolge = this.vorschlaege.slice();
        for (let i = this.vorschlaege.length - 1; i >= 0; i--) {
            if (this.vorschlaege.length == this.vorschlaege[i].bewertungen.sort()[this.vorschlaege[i].bewertungen.length - 1]) {
                this.reihenfolge.splice(i, 1);
            }
        }
    }
}

class Wahl1Stimme {
    constructor() {
        this.bezeichnung = "Nur 1. Stimme";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 0.0;
        this.stimmenanzahl = 1;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        let max = 0;
        for (const v of this.vorschlaege) {
            const zaehler = v.bewertungen.filter(b => b === 1).length;
            this.stimmenanzahl = v.bewertungen.length;
            v.zaehler = zaehler;
            max = Math.max(max, zaehler);
        }
        this.reihenfolge = this.vorschlaege.filter(v => v.zaehler === max);
        this.stimmenanteil = max / this.stimmenanzahl * 100;
    }
}

class Wahl2Stimmen {
    constructor() {
        this.bezeichnung = "1. und 2. Stimme gleich";
        this.vorschlaege = [];
        this.reihenfolge = [];
        this.stimmenanteil = 0.0;
        this.stimmenanzahl = 1;
    }

    sammleVorschlaege(vorschlaege) {
        this.vorschlaege = vorschlaege;
    }

    berechneReihenfolge() {
        let max = 0;
        for (const v of this.vorschlaege) {
            const zaehler = v.bewertungen.filter(b => b === 1 || b === 2).length;
            this.stimmenanzahl = v.bewertungen.length;
            v.zaehler = zaehler;
            max = Math.max(max, zaehler);
        }
        this.reihenfolge = this.vorschlaege.filter(v => v.zaehler === max);
        this.stimmenanteil = max / this.stimmenanzahl * 100;
    }
}

class Vorschlag {
    constructor(id, bewertungen, imdbJson) {
        this.id = id;
        this.bewertungen = bewertungen;
        this.imdbJson = imdbJson;
     
        this.titel = this.imdbJson['Title'];
        this.bildUrl = this.imdbJson['Poster'];
        this.bild = null;
        this.bildGeladen = false;
        this.bildhoehe = canvas.height * 0.6;
        this.bildbreite = this.bildhoehe * 10 / 16;
    }

    bildLaden() {
        return new Promise((resolve, reject) => {
            const imgElement = new Image();
            imgElement.onload = () => {
                this.bild = imgElement;
                this.bildGeladen = true;
                resolve();
            };
            imgElement.onerror = reject;
            imgElement.src = this.bildUrl;
        });
    }

    async zeichnen(pos, anzahl, stimmen) {
        const startY = canvas.height / 2 - this.bildhoehe / 2;
        const startX = (canvas.width / (anzahl + 1)) * (pos + 1) - this.bildbreite / 2;
        if (!this.bildGeladen) {
            await this.bildLaden();
        }        
        ctx.drawImage(this.bild, startX, startY, this.bildbreite, this.bildhoehe);   
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText(" " + Math.round(stimmen) + "%", startX + this.bildbreite / 3, startY + this.bildhoehe + 40); 
    }
}

class WahlSystemWahl {
    constructor() {
        this.wahlsysteme = [
            new Wahl1Stimme(),
            new Wahl2Stimmen(),
            new WahlKeineChance(),
            new WahlPlatzhalter1(),
            new WahlDurchschnittsplatz(),
            new WahlPlatzhalter2()
        ];
    }

    zeichnen() {
        let pos = 0;             
        const buttonFarbe = "#90AA23";    
        let buttonhoehe = canvas.height / 4;
        let buttonbreite = canvas.width / 3;
        let startY = canvas.height / 3 - buttonhoehe * 1.17;
        let startX = canvas.width / 2 - buttonbreite * 1.17;   
        for (const ws of this.wahlsysteme) {
            
            ctx.beginPath();
            ctx.fillStyle = buttonFarbe;
            ctx.fillRect(
                startX, 
                startY, 
                buttonbreite,
                buttonhoehe);
            ctx.stroke();

            ctx.beginPath();
            ctx.rect(
                startX, 
                startY, 
                buttonbreite,
                buttonhoehe);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 5;
            ctx.stroke();
            
            ctx.fillStyle = 'black';
            ctx.font = '40px Arial';
            ctx.fillText(ws.bezeichnung, startX + buttonbreite / 10, startY + buttonhoehe * 0.55); 

            pos++;
            if (pos % 2 == 0) {
                startX = canvas.width / 2 - buttonbreite * 1.17;
                startY += buttonhoehe * 1.33;
            } else {
                startX = canvas.width / 2 + buttonbreite * 0.17;
            }
        }   
    }
}

class Darstellen {
    constructor() {
        this.hintergrundfarbe = "#223322";
        this.vorschlaege = [];
        this.wahlsystem = new WahlSystemWahl();
        this.wahlsystemGewaehlt = false;
        this.wahlauswertung = null;

        this.generiereVorschlaege();
        this.addEventListeners();
    }

    generiereVorschlaege() {
        phpData.forEach((item, index) => {
            this.vorschlaege.push(new Vorschlag(
                item.id, 
                item.wahl.map(w => parseInt(w, 10)),
                JSON.parse(item.json['filme_imdb_json'])
            ));
        });
    }

    addEventListeners() {
        canvas.addEventListener('mousedown',  this.linksKlicken.bind(this));
        canvas.addEventListener('touchstart', this.linksKlicken.bind(this));
        // canvas.addEventListener('mouseup',  this.linksKlickenBeenden.bind(this));
        // canvas.addEventListener('touchend', this.linksKlickenBeenden.bind(this));
        // canvas.addEventListener('mousemove', this.mouseBewegen.bind(this));
        // canvas.addEventListener('touchmove', this.mouseBewegen.bind(this));

    }

    linksKlicken(e) {
        e.preventDefault();  
        let xIn, yIn;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            xIn = touch.pageX - canvas.offsetLeft;
            yIn = touch.pageY - canvas.offsetTop;
        } else {
            xIn = e.clientX - canvas.offsetLeft;
            yIn = e.clientY - canvas.offsetTop;
        }
        if (xIn >= 10 && xIn <= 72 &&
            yIn >= 10 && yIn <= 36) {
                this.wahlsystemGewaehlt = false;
                this.neuZeichnen();                
            }
        if (!this.wahlsystemGewaehlt) {
            let pos = 0;     
            let buttonhoehe = canvas.height / 4;
            let buttonbreite = canvas.width / 3;
            let startY = canvas.height / 3 - buttonhoehe * 1.17;
            let startX = canvas.width / 2 - buttonbreite * 1.17;     
            for (const ws of this.wahlsystem.wahlsysteme) {                
                if (xIn >= startX && xIn <= startX + buttonbreite &&
                    yIn >= startY && yIn <= startY + buttonhoehe) {
                        this.wahlauswertung = ws;
                        this.wahlauswertung.sammleVorschlaege(this.vorschlaege);
                        this.wahlauswertung.berechneReihenfolge();
                        this.wahlsystemGewaehlt = true;
                        this.neuZeichnen();
                    } 
                pos++;
                if (pos % 2 == 0) {
                startX = canvas.width / 2 - buttonbreite * 1.17;
                startY += buttonhoehe * 1.33;
                } else {
                    startX = canvas.width / 2 + buttonbreite * 0.17;
                }
            }   
        }
    }
    
    neuZeichnen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.zeichnen();
    }

    zeichnen() {
        ctx.beginPath();
        ctx.fillStyle = this.hintergrundfarbe;
        ctx.fillRect(
            0, 
            0, 
            canvas.width, 
            canvas.height);
        ctx.stroke();

        ctx.beginPath();
            ctx.rect(
                0, 
                0, 
                canvas.width, 
                canvas.height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 5;
            ctx.stroke();

        if (this.wahlsystemGewaehlt) {
            let pos = 0;
            for (const r of this.wahlauswertung.reihenfolge) {
                r.zeichnen(pos, this.wahlauswertung.reihenfolge.length, this.wahlauswertung.stimmenanteil);
                pos += 1;
            }

            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.fillRect(
                10, 
                10, 
                62,
                26);
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText("Main", 20, 30);
            
        } else {
            this.wahlsystem.zeichnen();
        }
    }

}

document.addEventListener('DOMContentLoaded', function() {
    const darstellung = new Darstellen();
    darstellung.zeichnen();
}); 