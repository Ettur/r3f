import { MutableRefObject, RefObject, useState, useRef, useEffect } from "react"
import { useStore } from "../store";
import gsap from "gsap";


export const Navigation = ():JSX.Element => {

    const navRef = useStore(state => state.navRef);
    const setView = useStore(state => state.setView);
    const currentView = useStore(state => state.view.current);
    const view = useStore(state => state.view)

    useEffect(() => {
        if( view.next === 'login'){
            fadeAnimation(false);
        }

        if(view.current === 'login' && view.next !== 'none'){
            fadeAnimation(true)
        }
    }, [view])

    const fadeAnimation = (show: boolean) => {
        if(navRef.current){
          gsap.fromTo(
            navRef.current,
            { opacity: navRef.current.style.opacity },
            {
              opacity: show ? 1 : 0,
              duration: .3,
            })
        }
      }

    const handleClick = (e: React.MouseEvent, nextView: string) => {
        view.current === 'login' ? '' : setView({ current: currentView, next: nextView})
    }

    return <>
        <div ref={navRef} className="navigation-container">
            <span className="nav-item">ROOT MOVEMENTS</span>
            <span className="nav-item">TECHNIQUE</span>
            <span className="nav-item">ABOUT</span>
        </div>
        <div className="header-container">
            <span>MARTIN AEDMA ONLINE</span>
            <button className="button-48" onClick={(e) => handleClick(e, 'login')}>
                <span>ENTER</span>
            </button>
        </div>
        <div className="footer-container">
            <img src="/linkedin.svg"/>
            <img src="/instagram.svg"/>
            <img src="/facebook.svg" />
        </div>
    </>
}