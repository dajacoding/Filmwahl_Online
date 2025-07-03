const canvas = document.getElementById('meinCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

const elementhoehe = window.innerHeight / (phpData.length > 5 ? phpData.length : 6);

function splitTextIntoLines(ctx, text, maxWidth) {
    if (!text) return [];
    const lines = [];
    let currentLine = '';
    const words = text.split(' ');
    for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth <= maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

class WahlSenden {
    constructor() {
        this.buttonFarbe = "green";
        this.stimmeAbgegeben = false;
        this.buttonPosition = [
            10,                         
            canvas.height - 80,         
            canvas.width - 20,          
            70                          
        ];
    }

    senden(liste) {
        // AJAX-Anfrage
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'wahl_senden.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        if (confirm("Diese Reihenfolge wirklich absenden?")) {

            return new Promise((resolve, reject) => {
                xhr.onreadystatechange = function() {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        if (this.status === 200) {
                            const response = JSON.parse(this.responseText);
                            console.log(response);
                            if (response['status'] === 'success') {
                                resolve('blue');
                            } else {
                                resolve(false);
                            }
                        } else {
                            reject('Fehler bei der Anfrage');
                        }
                    }
                };
                xhr.send(JSON.stringify({ wahl: liste }));
            });
        }

    }

    zeichnen() {
        if (!this.buttonPosition) return;
        ctx.beginPath();
        ctx.fillStyle = this.buttonFarbe;
        ctx.fillRect(
            this.buttonPosition[0], 
            this.buttonPosition[1], 
            this.buttonPosition[2], 
            this.buttonPosition[3]
        );
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.buttonFarbe === "green" ? "abstimmen" : "valide Stimmabgabe",
            this.buttonPosition[0] + this.buttonPosition[2] / 2,
            this.buttonPosition[1] + this.buttonPosition[3] / 2 + 7
        );
        ctx.textAlign = 'left';
    }
}

class Vorschlag {
    constructor(id = 0, imdb_json = "none") {
        this.imdb_json = JSON.parse(imdb_json);
        this.id = id;
        this.titel = this.imdb_json['Title'];
        this.kurzbeschreibung = this.imdb_json['Plot'] || "Keine Beschreibung verfügbar.";
        this.bildUrl = this.imdb_json['Poster'];
        this.bild = null;
        this.bildGeladen = false;
        this.bildhoehe = elementhoehe * 0.95;
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

    async zeichnen(pos) {
        const startY = pos * elementhoehe;
        const titelY = startY + 70;
        const beschreibungY = titelY + 45;
        const textStartX = this.bildbreite + 40;
        const maxBeschreibungWidth = canvas.width - textStartX - 30; 
        const lineHeight = 28; 
        const maxBeschreibungLines = 6; 

        ctx.beginPath();
        ctx.fillStyle = "#122322";
        ctx.fillRect(10, startY + 15, canvas.width - 20, elementhoehe - 10);
        ctx.stroke();

        if (!this.bildGeladen) await this.bildLaden();
        ctx.drawImage(this.bild, 20, startY + 20, this.bildbreite, this.bildhoehe);

        ctx.fillStyle = '#FFEEBB';
        ctx.font = '40px Arial';
        ctx.fillText(this.titel, textStartX, titelY);

        ctx.fillStyle = '#DDDDDD';
        ctx.font = '24px Arial';
        const beschreibungLines = splitTextIntoLines(ctx, this.kurzbeschreibung, maxBeschreibungWidth);
        for (let i = 0; i < Math.min(maxBeschreibungLines, beschreibungLines.length); i++) {
            ctx.fillText(beschreibungLines[i], textStartX, beschreibungY + i * lineHeight);
        }

        const infoY = startY + elementhoehe - 20;;
        const dauer = (this.imdb_json && this.imdb_json['Runtime']) || '';
        const genre = (this.imdb_json && this.imdb_json['Genre']) || '';
        const jahr = (this.imdb_json && this.imdb_json['Year']) || '';
        const land = (this.imdb_json && this.imdb_json['Country']) || '';

        const infos = [dauer, genre, jahr, land].filter(Boolean);
        let infoZeile = infos.join(" | ");

        ctx.fillStyle = '#AAAAAA';
        ctx.font = '20px Arial';
        ctx.fillText(infoZeile, textStartX, infoY);
    }
}

class Darstellen {
    constructor() {
        this.hintergrundfarbe = "#223322";
        this.wahl = new WahlSenden();
        this.vorschlaege = [];

        this.draggedIndex = null;
        this.initialTouchY = null;
        this.currentTouchY = null;
        this.isDragging = false;

        this.draggedItem = null;
        this.draggedItemY = 0; 

        this.sammleVorschlaege();        
        this.addEventListeners();
    }

    sammleVorschlaege() {
        phpData.forEach((item, index) => {
            const vorschlag = new Vorschlag(item['filme_id'], item['filme_imdb_json']);
            this.vorschlaege.push(vorschlag);  
        });
    }

    addEventListeners() {
        canvas.addEventListener('mousedown',  this.linksKlicken.bind(this));
        canvas.addEventListener('touchstart', this.linksKlicken.bind(this));
        canvas.addEventListener('mouseup',    this.linksKlickenBeenden.bind(this));
        canvas.addEventListener('touchend',   this.linksKlickenBeenden.bind(this));
        canvas.addEventListener('mousemove',  this.mouseBewegen.bind(this));
        canvas.addEventListener('touchmove',  this.mouseBewegen.bind(this), { passive: false });
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

        if (!this.wahl.stimmeAbgegeben){
            if (xIn >= this.wahl.buttonPosition[0] && xIn <= this.wahl.buttonPosition[2] + this.wahl.buttonPosition[0] &&
                yIn >= this.wahl.buttonPosition[1] && yIn <= this.wahl.buttonPosition[3] + this.wahl.buttonPosition[1]) {
                        this.wahl.senden(this.generiereListe())
                            .then(result => {
                                if (result === 'blue') {
                                    this.wahl.buttonFarbe = 'blue';
                                    this.wahl.stimmeAbgegeben = true;
                                    this.neuZeichnen();
                                }
                            })
                            .catch(error => {
                                console.error('Ein Fehler ist aufgetreten:', error);
                            });
            }     
        }

        const index = Math.floor(yIn / elementhoehe);
        if (index >= 0 && index < this.vorschlaege.length) {
            this.draggedIndex = index;
            this.draggedItem = this.vorschlaege[index];
            this.initialTouchY = yIn;
            this.currentTouchY = yIn;
            this.isDragging = true;
        }
    }

    linksKlickenBeenden(e) {
        e.preventDefault();
        if (this.isDragging && this.draggedIndex !== null && this.currentTouchY !== null) {
            const newIndex = Math.min(
                Math.max(0, Math.floor(this.currentTouchY / elementhoehe)),
                this.vorschlaege.length - 1
            );
            if (newIndex !== this.draggedIndex) {
                const draggedItem = this.vorschlaege[this.draggedIndex];
                this.vorschlaege.splice(this.draggedIndex, 1);
                this.vorschlaege.splice(newIndex, 0, draggedItem);
            }
        }
        this.isDragging = false;
        this.draggedIndex = null;
        this.initialTouchY = null;
        this.currentTouchY = null;
        this.neuZeichnen();
    }


    mouseBewegen(e) {
        e.preventDefault();
        if (!this.isDragging) return;

        let yIn;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            yIn = touch.pageY - canvas.offsetTop;
        } else {
            yIn = e.clientY - canvas.offsetTop;
        }
        this.currentTouchY = yIn;
        this.neuZeichnen();
    }

    generiereListe() {
        let liste = [];
        for (const v of this.vorschlaege) {
            liste.push(v.id);
        }
        return liste;
    }

    getTemporaereListe() {
        if (!this.isDragging || this.draggedIndex === null || this.currentTouchY === null) {
            return this.vorschlaege; 
        }

        const tempList = [...this.vorschlaege];
        const newIndex = Math.min(
            Math.max(0, Math.floor(this.currentTouchY / elementhoehe)),
            tempList.length - 1
        );

        if (newIndex === this.draggedIndex) {
            return tempList; 
        }

        const draggedItem = tempList[this.draggedIndex];
        tempList.splice(this.draggedIndex, 1);
        tempList.splice(newIndex, 0, draggedItem);

        return tempList;
    }


    neuZeichnen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.zeichnen();
    }

    async zeichnen() {
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

        const tempList = this.getTemporaereListe();
        for (let pos = 0; pos < tempList.length; pos++) {
            if (this.isDragging && tempList[pos] === this.draggedItem) continue;
            await tempList[pos].zeichnen(pos);
        }

        if (this.isDragging && this.draggedItem) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            const drawY = this.currentTouchY - (elementhoehe / 2);
            ctx.fillStyle = "#122322";
            ctx.fillRect(10, drawY, canvas.width - 20, elementhoehe - 10);
            ctx.drawImage(this.draggedItem.bild, 20, drawY + 5, this.draggedItem.bildbreite, this.draggedItem.bildhoehe);
            ctx.fillStyle = '#FFEEBB';
            ctx.font = '40px Arial';
            ctx.fillText(this.draggedItem.titel, this.draggedItem.bildbreite + 40, drawY + 70);
            ctx.restore();
        }

        this.wahl.zeichnen();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const darstellung = new Darstellen();
    darstellung.zeichnen();
}); 