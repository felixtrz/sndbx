import {
	BODY_TYPES,
	CubeObject,
	GLTFObject,
	MovementObstacle,
	MovementSurface,
	RigidBodyComponent,
	SingleUseGameSystem,
	SphereObject,
	THREE,
} from 'elixr';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry';

export class InlineSceneCreationSystem extends SingleUseGameSystem {
	update() {
		const room = new THREE.LineSegments(
			new BoxLineGeometry(5.98, 2.98, 5.98, 10, 5, 10),
			new THREE.LineBasicMaterial({ color: 0x808080 }),
		);
		room.geometry.translate(0, 1.5, 0);
		this.core.scene.add(room);
		this.core.scene.background = new THREE.Color(0x505050);

		this._createLighting();

		this._createWalls();

		this._createCubes();

		const snowman = new GLTFObject('assets/Snowman.glb', {
			hasPhysics: true,
			mass: 1,
			type: BODY_TYPES.DYNAMIC,
		});
		this.core.addGameObject(snowman);
		snowman.position.set(0, 1.2, 0);
		snowman.rotateZ(Math.PI / 4);
		snowman.colliderVisible = true;
	}

	_createLighting() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		this.core.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
		this.core.scene.add(directionalLight);
	}

	_createWalls() {
		const boxFloor = new CubeObject(
			6,
			0.02,
			6,
			{ color: 0xff5f1f },
			{ mass: 0, type: BODY_TYPES.STATIC },
		);
		this.core.addGameObject(boxFloor);
		boxFloor.visible = false;
		boxFloor.addComponent(MovementSurface);

		const boxCeiling = boxFloor.clone(true);
		this.core.addGameObject(boxCeiling);
		boxCeiling.position.set(0, 3, 0);

		const boxWall = new CubeObject(
			6,
			3,
			0.02,
			{ color: 0xff5f1f },
			{ mass: 0, type: BODY_TYPES.STATIC },
		);
		this.core.addGameObject(boxWall);
		boxWall.visible = false;
		boxWall.position.set(0, 1.5, -3);
		boxWall.addComponent(MovementObstacle);

		const boxWall2 = boxWall.clone(true);
		this.core.addGameObject(boxWall2);
		boxWall2.position.set(0, 1.5, 3);

		const boxWall3 = boxWall.clone(true);
		this.core.addGameObject(boxWall3);
		boxWall3.position.set(3, 1.5, 0);
		boxWall3.rotateY(Math.PI / 2);

		const boxWall4 = boxWall.clone(true);
		this.core.addGameObject(boxWall4);
		boxWall4.position.set(-3, 1.5, 0);
		boxWall4.rotateY(Math.PI / 2);
	}

	_createCubes() {
		const randomObjects = [];

		for (let i = 0; i < 50; i++) {
			const cube = new CubeObject(
				0.2 * Math.random() + 0.1,
				0.2 * Math.random() + 0.1,
				0.2 * Math.random() + 0.1,
				{ color: Math.random() * 0xffffff },
				{ mass: 1, type: BODY_TYPES.DYNAMIC },
			);
			this.core.addGameObject(cube);
			randomObjects.push(cube);
		}

		for (let i = 0; i < 50; i++) {
			const sphere = new SphereObject(
				0.1 * Math.random() + 0.05,
				{ color: Math.random() * 0xffffff },
				{ mass: 1, type: BODY_TYPES.DYNAMIC },
			);
			this.core.addGameObject(sphere);
			randomObjects.push(sphere);
		}

		randomObjects.forEach((object) => {
			object.position.set(
				Math.random() * 6 - 3,
				Math.random() * 3,
				Math.random() * 6 - 3,
			);
			const rigidBodyComponent = object.getMutableComponent(RigidBodyComponent);
			rigidBodyComponent.angularDamping = 0;
			rigidBodyComponent.linearDamping = 0;
			rigidBodyComponent.initVelocity = new THREE.Vector3(
				Math.random() - 0.5,
				Math.random() - 0.5,
				Math.random() - 0.5,
			)
				.normalize()
				.multiplyScalar(Math.random() * 5);
		});
	}
}
