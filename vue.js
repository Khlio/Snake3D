window.onload = function () {
	var serpent = new Array();
	var jeu = new Jeu();

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(50, 4/3, 1, 10000);
	camera.position.set(20, 20, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	var rendu = new THREE.WebGLRenderer({canvas: document.getElementById('3d')});
	rendu.setSize(1200, 800);
	
	var plateforme = new THREE.Mesh(new THREE.CubeGeometry(TAILLE_PLATEFORME, TAILLE_PLATEFORME, TAILLE_PLATEFORME),
									new THREE.MeshBasicMaterial({ wireframe: true, color: COULEUR_PLATEFORME }));
	scene.add(plateforme);
	
	var nourriture = new THREE.Mesh(new THREE.CubeGeometry(CASE, CASE, CASE),
									new THREE.MeshBasicMaterial({ color: COULEUR_NOURRITURE }));
	scene.add(nourriture);
	positionneNourriture();
	
	var geometrie = new THREE.CubeGeometry(CASE, CASE, CASE);
	var materiel = new THREE.MeshBasicMaterial( { color: COULEUR_SERPENT } );
	for (var i = 0; i < jeu.getTailleSerpent(); i++) {
		serpent.push(new THREE.Mesh(geometrie, materiel));
		serpent[i].position.x = jeu.getSerpent()[i][X];
		scene.add(serpent[i]);
	}
	rafraichir();
	
	document.addEventListener('keydown', jeu.definisDirection);
	setInterval(animation, VITESSE);
	
	function animation() {
		if (jeu.mangeNourriture()) {
			positionneNourriture();
			var cube = serpent[0].clone();
			serpent.unshift(cube);
			scene.add(cube);
		}
		jeu.definisPosition();
		var queue = serpent.shift();
		queue.position.set(jeu.getTeteSerpent()[X], jeu.getTeteSerpent()[Y], jeu.getTeteSerpent()[Z]);
		serpent.push(queue);
		jeu.setPositionChangeeDansLaVue(true);
		rafraichir();
	}
	
	function positionneNourriture() {
		var positionNourriture = jeu.genereNourriture();
		nourriture.position.set(positionNourriture[X], positionNourriture[Y], positionNourriture[Z]);
	}
	
	function rafraichir() {
		rendu.render(scene, camera);
	}
}