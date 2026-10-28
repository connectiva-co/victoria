import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Customer, PreparedIceCream, VictoriaCustomization } from '@/src/types/game';
import { createVictoriaModel, createCustomerModel, VictoriaCharacter, CustomerCharacter } from './characterModels';
import { createIceCream3D } from './iceCreamModel';
import { createMarbleTexture } from './materials';

export class ShopScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationFrameId: number = 0;
  private clock: THREE.Clock;
  private isSoftwareGl: boolean;
  private isDisposed: boolean = false;

  // Actors and Scene Objects
  private victoria: VictoriaCharacter;
  private currentCustomerChar: CustomerCharacter | null = null;
  private iceCreamGroup: THREE.Group | null = null;
  private iceCreamMount: THREE.Group;
  private buntingGroup: THREE.Group;

  // Camera targets
  private targetCameraPos = new THREE.Vector3(0, 2.2, 3.6);
  private currentCameraPos = new THREE.Vector3(0, 2.2, 3.6);
  private targetLookAt = new THREE.Vector3(0, 0.9, 0);
  private currentLookAt = new THREE.Vector3(0, 0.9, 0);

  constructor(container: HTMLElement, victoriaCustomization: VictoriaCustomization) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Software WebGL Probe
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 3. Scene & RoomEnvironment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfef2f2); // warm pastel cream/pink
    this.scene.fog = new THREE.Fog(0xfef2f2, 8, 16);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 4. Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      30
    );
    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookAt);

    // 5. Lighting
    this.setupLighting();

    // 6. Shop Environment (Counter, Floor, Walls, Decor)
    this.setupShopEnvironment();

    // 7. Victoria Character
    this.victoria = createVictoriaModel(victoriaCustomization);
    this.victoria.group.position.set(-0.65, 0, -0.6); // Standing behind the counter
    this.scene.add(this.victoria.group);

    // 8. Ice Cream Staging Mount on Counter
    this.iceCreamMount = new THREE.Group();
    this.iceCreamMount.position.set(0, 0.95, 0.05); // Right on the center of the counter
    this.scene.add(this.iceCreamMount);

    // 9. Bunting Decor
    this.buntingGroup = this.createBunting();
    this.scene.add(this.buntingGroup);

    // Bind resize
    window.addEventListener('resize', this.onResize);

    // Pre-warm shaders
    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Start render loop
    this.tick();
  }

  private setupLighting() {
    // Warm Key Light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    keyLight.position.set(3, 6, 4);
    if (!this.isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      keyLight.shadow.camera.left = -3;
      keyLight.shadow.camera.right = 3;
      keyLight.shadow.camera.top = 3;
      keyLight.shadow.camera.bottom = -3;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfce7f3, 0.9);
    this.scene.add(hemiLight);

    // Subtle front warm spot for ice cream highlighting
    const counterSpot = new THREE.PointLight(0xfef08a, 0.8, 4);
    counterSpot.position.set(0, 2.2, 0.8);
    this.scene.add(counterSpot);
  }

  private setupShopEnvironment() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xfdf4ff,
      roughness: 0.35,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !this.isSoftwareGl;
    this.scene.add(floor);

    // Back Wall
    const wallGeo = new THREE.PlaneGeometry(12, 6);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfce7f3, // Soft pink wall
      roughness: 0.8,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 3, -3);
    this.scene.add(wall);

    // Menu chalkboard on back wall
    const boardGeo = new THREE.BoxGeometry(2.4, 1.2, 0.04);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 2.8, -2.95);

    // Gold frame
    const frameGeo = new THREE.BoxGeometry(2.5, 1.3, 0.02);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.6, roughness: 0.3 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 2.8, -2.97);
    this.scene.add(board, frame);

    // Main Service Counter
    const counterGroup = new THREE.Group();
    counterGroup.position.set(0, 0, 0);

    // Base cabinet (pastel mint / cream)
    const baseGeo = new THREE.BoxGeometry(3.6, 0.9, 1.1);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf0fdf4,
      roughness: 0.5,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.45, 0);
    base.castShadow = !this.isSoftwareGl;
    base.receiveShadow = !this.isSoftwareGl;
    counterGroup.add(base);

    // Marble countertop
    const topGeo = new THREE.BoxGeometry(3.8, 0.08, 1.25);
    const topMat = new THREE.MeshStandardMaterial({
      map: createMarbleTexture(),
      roughness: 0.25,
      metalness: 0.05,
    });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(0, 0.94, 0);
    top.castShadow = !this.isSoftwareGl;
    top.receiveShadow = !this.isSoftwareGl;
    counterGroup.add(top);

    // Brass edge molding
    const brassGeo = new THREE.BoxGeometry(3.84, 0.04, 1.28);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const brass = new THREE.Mesh(brassGeo, brassMat);
    brass.position.set(0, 0.92, 0);
    counterGroup.add(brass);

    // Ice Cream Display Cooler on the counter (right side)
    const coolerGroup = new THREE.Group();
    coolerGroup.position.set(1.0, 0.98, 0);

    const coolerBodyGeo = new THREE.BoxGeometry(1.4, 0.22, 0.6);
    const coolerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const coolerBody = new THREE.Mesh(coolerBodyGeo, coolerMat);
    coolerGroup.add(coolerBody);

    // 5 Colorful Ice cream tubs inside cooler
    const tubColors = [0xfef08a, 0x5c2d13, 0xf43f5e, 0xfb923c, 0xb45309];
    tubColors.forEach((color, i) => {
      const tubGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.12, 12);
      const tubMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
      const tub = new THREE.Mesh(tubGeo, tubMat);
      tub.position.set(-0.48 + i * 0.24, 0.08, 0);
      coolerGroup.add(tub);
    });

    // Glass sneeze guard / display case
    const glassGuardGeo = new THREE.BoxGeometry(1.42, 0.28, 0.62);
    const glassGuardMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: this.isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: this.isSoftwareGl ? 0.3 : 0.85,
      roughness: 0.1,
    });
    const glassGuard = new THREE.Mesh(glassGuardGeo, glassGuardMat);
    glassGuard.position.set(0, 0.15, 0);
    coolerGroup.add(glassGuard);
    counterGroup.add(coolerGroup);

    // Golden service bell on the counter (left side)
    const bellGroup = new THREE.Group();
    bellGroup.position.set(-1.4, 0.98, 0.1);
    const bellBaseGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.03, 16);
    const bellBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const bellBase = new THREE.Mesh(bellBaseGeo, bellBaseMat);

    const bellDomeGeo = new THREE.SphereGeometry(0.08, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.15 });
    const bellDome = new THREE.Mesh(bellDomeGeo, goldMat);
    bellDome.position.y = 0.02;

    const bellPinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 8);
    const bellPin = new THREE.Mesh(bellPinGeo, goldMat);
    bellPin.position.y = 0.1;

    bellGroup.add(bellBase, bellDome, bellPin);
    counterGroup.add(bellGroup);

    this.scene.add(counterGroup);
  }

  private createBunting(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(0, 3.4, -1.8);

    const flagColors = [0xf472b6, 0x38bdf8, 0xfacc15, 0xa78bfa, 0x4ade80, 0xfb923c];
    for (let i = 0; i < 9; i++) {
      const flagGeo = new THREE.ConeGeometry(0.18, 0.35, 3);
      const flagMat = new THREE.MeshStandardMaterial({
        color: flagColors[i % flagColors.length],
        roughness: 0.6,
      });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      // Dip slightly like a hanging garland
      const x = -2.2 + i * 0.55;
      const sag = Math.sin((i / 8) * Math.PI) * 0.25;
      flag.position.set(x, -sag, 0);
      flag.rotation.z = Math.PI;
      group.add(flag);
    }

    return group;
  }

  // --- Public APIs ---

  public updateIceCream(prepared: PreparedIceCream) {
    if (this.iceCreamGroup) {
      this.iceCreamMount.remove(this.iceCreamGroup);
      this.disposeHierarchy(this.iceCreamGroup);
      this.iceCreamGroup = null;
    }

    this.iceCreamGroup = createIceCream3D(prepared, this.isSoftwareGl);
    this.iceCreamMount.add(this.iceCreamGroup);
  }

  public setCustomer(customer: Customer | null, onArrived?: () => void) {
    if (this.currentCustomerChar) {
      this.scene.remove(this.currentCustomerChar.group);
      this.disposeHierarchy(this.currentCustomerChar.group);
      this.currentCustomerChar = null;
    }

    if (customer) {
      this.currentCustomerChar = createCustomerModel(customer);
      // Spawn at the shop entrance (right flank)
      this.currentCustomerChar.group.position.set(2.8, 0, 1.2);
      this.scene.add(this.currentCustomerChar.group);

      // Walk smoothly to the counter order spot
      this.currentCustomerChar.walkTo(0.2, 1.2, () => {
        // Face the counter
        this.currentCustomerChar?.group.lookAt(0.2, 0, 0);
        if (onArrived) onArrived();
      });
    }
  }

  public customerLeave(onLeft?: () => void) {
    if (this.currentCustomerChar) {
      this.currentCustomerChar.walkTo(-3.2, 1.2, () => {
        if (this.currentCustomerChar) {
          this.scene.remove(this.currentCustomerChar.group);
          this.disposeHierarchy(this.currentCustomerChar.group);
          this.currentCustomerChar = null;
        }
        if (onLeft) onLeft();
      });
    } else {
      if (onLeft) onLeft();
    }
  }

  public triggerVictoriaScoop() {
    this.victoria.triggerScoop();
  }

  public triggerCustomerCelebrate() {
    this.victoria.triggerCelebrate();
    this.currentCustomerChar?.triggerCelebrate();
  }

  public triggerCustomerDisappoint() {
    this.currentCustomerChar?.triggerDisappoint();
  }

  public setCameraMode(mode: 'parlor' | 'assembly' | 'closeUp') {
    if (mode === 'parlor') {
      this.targetCameraPos.set(0, 2.2, 3.6);
      this.targetLookAt.set(0, 0.9, 0);
    } else if (mode === 'assembly') {
      this.targetCameraPos.set(0, 1.6, 1.8);
      this.targetLookAt.set(0, 1.05, 0);
    } else if (mode === 'closeUp') {
      this.targetCameraPos.set(0.1, 1.35, 1.1);
      this.targetLookAt.set(0, 1.15, 0.05);
    }
  }

  private onResize = () => {
    if (!this.container || this.isDisposed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private tick = () => {
    if (this.isDisposed) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth camera damping
    this.currentCameraPos.lerp(this.targetCameraPos, delta * 3.5);
    this.currentLookAt.lerp(this.targetLookAt, delta * 3.5);
    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookAt);

    // Update actors
    this.victoria.update(elapsedTime, delta);
    if (this.currentCustomerChar) {
      this.currentCustomerChar.update(elapsedTime, delta);
    }

    // Gentle float/rotation on active ice cream when in assembly
    if (this.iceCreamGroup) {
      this.iceCreamGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private disposeHierarchy(obj: THREE.Object3D) {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
  }

  public dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
