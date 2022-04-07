import type { NextPage } from 'next'
import { Navigation } from '../src/components/Navigation'
import { Login } from '../src/components/Login'
import dynamic from 'next/dynamic'
import { useStore } from '../src/store'
import { useEffect } from 'react'
import gsap from 'gsap'

const CanvasComponent = dynamic(() => import('../src/components/CanvasComponent'), {ssr:false})

const Home: NextPage = () => {

  const animRef = useStore(state => state.animRef);
  const navRef = useStore(state => state.navRef);
  const view = useStore(state => state.view);
  const setView = useStore(state => state.setView);

  const displayContent = () => {
    switch(view.current){
      case 'landing':
        return <CanvasComponent/>
      case 'login':
        return <Login/>
    }
  }

  useEffect(() => {
    switch(view.next){
      case 'none':
        animateContainer(true);
        return;
      default:
        animateContainer(false);
    }
  }, [view])

  const animateContainer = (show: boolean) => {
    if(animRef.current){
      gsap.fromTo(
        animRef.current,
        { opacity: animRef.current.style.opacity },
        {
          opacity: show ? 1 : 0,
          duration: .3,
          onComplete: onComplete,
          onCompleteParams:[view.next]
        })
    }
  }

  function onComplete(nextView: string) {
    if(nextView !== 'none'){
      setView({current: nextView, next: 'none'})
    }
  }

  return (
    <div className='app-container'>
      <Navigation/>
      <div className='maincontent-container'>
        <div ref={animRef} className='animation-container'>
          {displayContent()}
        </div>
      </div>
    </div>
  )
}

export default Home
