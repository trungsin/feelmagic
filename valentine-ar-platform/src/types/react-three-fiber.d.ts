import { Object3DNode, ThreeElement, extend } from "@react-three/fiber";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ThreeElement<typeof THREE.Group>;
      mesh: ThreeElement<typeof THREE.Mesh>;
      points: ThreeElement<typeof THREE.Points>;
      bufferGeometry: ThreeElement<typeof THREE.BufferGeometry>;
      bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>;
      planeGeometry: ThreeElement<typeof THREE.PlaneGeometry>;
      pointsMaterial: ThreeElement<typeof THREE.PointsMaterial>;
      meshBasicMaterial: ThreeElement<typeof THREE.MeshBasicMaterial>;
    }
  }
}
