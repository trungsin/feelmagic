// Type declarations for React Three Fiber
// This extends JSX.IntrinsicElements to include Three.js elements

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: any;
    mesh: any;
    points: any;
    bufferGeometry: any;
    bufferAttribute: any;
    planeGeometry: any;
    pointsMaterial: any;
    meshBasicMaterial: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      planeGeometry: any;
      pointsMaterial: any;
      meshBasicMaterial: any;
    }
  }
}

export {};
