import React, { useEffect, useRef, useState, MutableRefObject } from 'react'
import * as THREE from 'three'
import { Canvas, ReactThreeFiber, ThreeEvent, useFrame, extend } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import { TestMaterial } from './Material'
import { useStore } from "../store";
// import { OrbitControls, Text } from '@react-three/drei'

extend({ TestMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      testMaterial: ReactThreeFiber.Object3DNode<TestMaterial, typeof TestMaterial>
    }
  }
}

interface BoxProps {
  materialRef: MutableRefObject<THREE.ShaderMaterial | null>
  cameraRef: MutableRefObject<THREE.PerspectiveCamera | null>
}

const loader = new THREE.TextureLoader;
const textures: THREE.Texture[] = [];
textures.push(loader.load('1c.jpg'));
textures.push(loader.load('2c.jpg'));
textures.push(loader.load('4c.jpg'));

const CanvasComponent = ():JSX.Element => {

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  return <div className='canvas-container'>
            <Canvas>
              <color attach='background' args={["white"]}/>
              <PerspectiveCamera
                makeDefault
                position={[0, 0, 300]}
                fov={50}
                aspect={window.innerWidth / window.innerHeight}
                near={1}
                far={500}
                ref={cameraRef}
              />
              <Cube materialRef={materialRef} cameraRef={cameraRef}/>
            </Canvas>
        </div>
}

const Cube = ({materialRef, cameraRef} : BoxProps) => {

  const navRef = useStore(state => state.navRef)
  const [viewSize, setViewSize] = useState({width: 0, height: 0})
  const [animationInfo, setAnimationInfo] = useState({isAnimating: false, currentTexture: 0});

  useEffect(() => {
    if(materialRef.current){
      materialRef.current.uniforms.uTextureOne.value = textures[animationInfo.currentTexture];
    }
    updatePlaneDimensions();
    window.addEventListener("resize", updatePlaneDimensions);
    return () => window.removeEventListener("resize", updatePlaneDimensions);
  }, [])

  const updatePlaneDimensions = () => {
    if(cameraRef.current){
      const aspect = cameraRef.current.aspect
      var vFOV = THREE.MathUtils.degToRad( cameraRef.current.fov ); // convert vertical fov to radians
      var height = 2 * Math.tan( vFOV / 2 ) * cameraRef.current.position.z; // visible height
      var width = height * cameraRef.current.aspect;           // visible width
      const diff = width - height;

      if (diff > 100 ){
        height += diff / 5.5;
      }
      setViewSize(prev => {return {width: width, height: height}})
    }
  };

  useFrame(({clock, mouse, size, camera}) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      // materialRef.current.uniforms.uMouse.value = {x: mouse.x / 2 + 0.5, y: mouse.y / 2 + 0.5};
      materialRef.current.uniforms.uRes.value = { x: size.width, y: size.height};
    }
  })

  const pointerMove = (e: ThreeEvent<PointerEvent>) => {
    if(materialRef.current){
      materialRef.current.uniforms.uMouse.value = {x: e.point.x, y: e.point.y};
    }
    displayTexture(calculatePercentage({x: e.point.x, y: e.point.y}));
  }

  const calculatePercentage = (pointer: {x: number, y:number}):number => {
    let percentage = 0;
    if(navRef.current){
      const containerWidth = navRef.current.clientWidth - 300;
      const planeWidth = viewSize.width;
      const pointCoordX = pointer.x + viewSize.width / 2 ;
      percentage = pointCoordX / planeWidth;
      const transformContainerBy = containerWidth * percentage;
      navRef.current.style.transform = `translateX(-${transformContainerBy}px)`
    }
    return percentage
  }

  const triggerGSAP = (texture: number) => {
    if(materialRef.current){
      setAnimationInfo( prev => { return { isAnimating: true, currentTexture: texture }});
      materialRef.current.uniforms.uTextureTwo.value = textures[texture];
      gsap.fromTo(
        materialRef.current.uniforms.uProgress,
        { value: 0 },
        { ease: 'Power2.easeOut',
          value: 1,
          onComplete: onComplete,
          onCompleteParams:[texture]
        });
    }
  }

  function onComplete(num: number) {
    if(materialRef.current){
      materialRef.current.uniforms.uTextureOne.value = textures[num]
      materialRef.current.uniforms.uProgress.value = 0;
      setAnimationInfo(prev => { return {...prev, isAnimating: false}})

      // Check if mouse skipped a picture during animation
      const mouse = materialRef.current.uniforms.uMouse.value;
      const percentage = calculatePercentage({x: mouse.x, y: mouse.y})
      let number = percentage > 0.33 ? percentage > 0.66 ? 2 : 1 : 0;
      if (num !== number){
        displayTexture(percentage)
      }
    }
  }

  const displayTexture = (percentage: number) => {
    // console.log(percentage)
    if( percentage < 0.33 && !animationInfo.isAnimating && animationInfo.currentTexture !== 0){
      triggerGSAP(0);
      return;
    }

    if(percentage > 0.33 && percentage < 0.66 && !animationInfo.isAnimating && animationInfo.currentTexture !== 1){
      triggerGSAP(1);
      return;
    }

    if(percentage > 0.66 && !animationInfo.isAnimating && animationInfo.currentTexture !== 2){
      triggerGSAP(2);
    }
  }

  return (<mesh onPointerMove={pointerMove}>
    <planeBufferGeometry attach='geometry' args={[viewSize.height * 16/9 , viewSize.height, 1, 1]}/>
    <testMaterial
      ref={materialRef}
    />
  </mesh>)
  }

export default CanvasComponent

