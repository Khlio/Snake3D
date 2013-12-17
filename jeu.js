function Jeu(_pas, _taillePlateforme) {
	this.X = 0;
	this.Y = 1;
	this.Z = 2;
	var PAS = _pas;
	var TAILLE_PLATEFORME = _taillePlateforme;
	var LIMITE = Math.round(TAILLE_PLATEFORME/2);

	var FLECHE_GAUCHE = 37;
	var FLECHE_DROITE = 39;
	var FLECHE_HAUT = 38;
	var FLECHE_BAS = 40;
	var TOUCHE_S = 83;
	var TOUCHE_Z = 90;
	var TOUCHES = new Array([FLECHE_DROITE, FLECHE_GAUCHE, FLECHE_HAUT, FLECHE_BAS, TOUCHE_S, TOUCHE_Z], 
							[this.X, this.X, this.Y, this.Y, this.Z, this.Z]);

	var tailleSerpent = 3;
	var serpent = new Array();
	var direction = [1, 0, 0];
	var nourriture = [0, 0, 0];
	var positionChangeeDansLaVue = false;
	
	for (var i = 0; i < tailleSerpent; i++) {
		serpent[i] = [i * PAS, 0, 0];
	}
	
	this.definisDirection = function(event) {
		if (positionChangeeDansLaVue) {
			for (var i = 0; i < TOUCHES[0].length; i++) {
				if (event.keyCode == TOUCHES[0][i]) {
					changeDirection(TOUCHES[1][i], (i%2 == 0 ? 1 : -1));
					break;
				}
			}
		}
	}

	changeDirection = function(coordonnee, axeDirection) {
		if (0 == direction[coordonnee]) {
			direction = [0, 0, 0];
			direction[coordonnee] = axeDirection;
			positionChangeeDansLaVue = !positionChangeeDansLaVue;
		}
	}

	this.definisPosition = function() {
		for (var i = 0; i < direction.length; i++) {
			if (0 != direction[i]) {
				var tete = serpent[tailleSerpent-1];
				var queue = serpent.shift();
				for (var j = 0; j < queue.length; j++) {
					queue[j] = tete[j] + (direction[j] * PAS);
				}
				serpent.push(queue);
				
				if (LIMITE * direction[i] - PAS  == tete[i]) {
					serpent[tailleSerpent-1][i] = (LIMITE * -direction[i]) + (direction[i] * PAS);
				}
				break;
			}
		}
		if (this.seMange()) {
			alert('Ooops ! Je me suis mangé...');
			window.location.reload();
		}
	}
	
	this.seMange = function() {
		var tete = this.getTeteSerpent();
		var seMange = false;
		for (var i = 0; !seMange && i < tailleSerpent-1; i++) {
			seMange = true;
			for (var j = 0; j < tete.length; j++) {
				seMange &= (tete[j] == serpent[i][j]);
			}
		}
		return seMange;
	}

	this.genereNourriture = function() {
		for (var i = 0; i < nourriture.length; i++) {
			nourriture[i] = nombreAleatoire(-(LIMITE-PAS), LIMITE-PAS);
		}
		nourriture[0] = 5;
		return nourriture;
	}

	nombreAleatoire = function(de, a) {
		return Math.floor(Math.random() * (a - de + 1) + de);
	}
	
	this.mangeNourriture = function() {
		var mange = this.peutManger();
		if (mange) {
			this.serpentGrandit();
		}
		return mange;
	}
	
	this.peutManger = function() {
		var tete = this.getTeteSerpent();
		var peutManger = true;
		for (var i = 0; peutManger && i < tete.length; i++) {
			if (tete[i] + direction[i] * PAS != nourriture[i]) {
				peutManger = !peutManger;
			}
		}
		return peutManger;
	}
	
	this.serpentGrandit = function() {
		tailleSerpent++;
		serpent.unshift(serpent[0].slice(0));
	}
	
	this.setPositionChangeeDansLaVue = function(_positionChangeeDansLaVue) {
		positionChangeeDansLaVue = _positionChangeeDansLaVue;
	}

	this.getSerpent = function() {
		return serpent;
	}

	this.getTeteSerpent = function() {
		return serpent[tailleSerpent-1];
	}
	
	this.getTailleSerpent = function() {
		return tailleSerpent;
	}
}