import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const randomHeight = () => Math.random() * 10 + 5; // higher starting point

// Imperative per-frame update lives outside the component on purpose:
// it mutates Three.js buffers, which is expected for animation.
const updateParticles = (geometry, speeds, count) => {
    const attr = geometry.attributes.position;
    if (!attr || !speeds) return;

    const positions = attr.array;
    for (let i = 0; i < count; i++) {
        let y = positions[i * 3 + 1] - speeds[i];
        if (y < -2) y = randomHeight();
        positions[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
};

const Particles = ({ count = 200 }) => {
    const mesh = useRef();
    const speeds = useRef(null);

    useLayoutEffect(() => {
        const positions = new Float32Array(count * 3);
        const particleSpeeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = randomHeight();
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            particleSpeeds[i] = 0.005 + Math.random() * 0.001;
        }

        speeds.current = particleSpeeds;
        mesh.current.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
    }, [count]);

    useFrame(() => {
        if (mesh.current) {
            updateParticles(mesh.current.geometry, speeds.current, count);
        }
    });

    return (
        <points ref={mesh} frustumCulled={false}>
            <bufferGeometry />
            <pointsMaterial
                color="#ffffff"
                size={0.05}
                transparent
                opacity={0.9}
                depthWrite={false}
            />
        </points>
    );
};

export default Particles;