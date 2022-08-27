import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { BufferGeometry, Mesh } from "three";
import * as THREE from "three";

const COLOR = "#fff";

interface IProps {
  geometry: BufferGeometry;
}

export default function Rock({ geometry }: IProps) {
  const rock = useRef<Mesh>();
  useFrame(({ clock }) => {
    if (!rock.current) {
      return;
    }
    rock.current.rotation.y = clock.getElapsedTime() / 10.0;
    rock.current.rotation.z = clock.getElapsedTime() / 10.0;
    rock.current.rotation.x = clock.getElapsedTime() / 10.0;
  });

  const textureUrl = "/textures/space.jpg";
  const textureUrls = [textureUrl, textureUrl, textureUrl, textureUrl, textureUrl, textureUrl];
  const textureCube = new THREE.CubeTextureLoader().load(textureUrls);
  textureCube.wrapS = THREE.MirroredRepeatWrapping;
  textureCube.wrapT = THREE.MirroredRepeatWrapping;
  textureCube.mapping = THREE.CubeRefractionMapping;

  return (
    <>
      <ambientLight color={[1, 1, 1]} />
      <pointLight intensity={2} position={[-10, -10, -10]} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <mesh ref={rock} geometry={geometry}>
        <meshPhongMaterial color={COLOR} envMap={textureCube} refractionRatio={0.7} reflectivity={1} flatShading={true} />
      </mesh>
    </>
  );
}
