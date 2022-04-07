import { createRef, MutableRefObject } from "react";
import create, { GetState, SetState } from "zustand";
import { persist, StoreApiWithPersist, StoreApiWithSubscribeWithSelector, subscribeWithSelector  } from 'zustand/middleware'

interface View {
    current: string,
    next: string
}

interface AppState {
    navRef: MutableRefObject<HTMLDivElement | null> ;
    animRef: MutableRefObject<HTMLDivElement | null> ;
    view: View;
    token: string;
    setView: (view: View) => void;
    setToken: (token: string) => void;
}


export const useStore = create(
    subscribeWithSelector(
      persist<
        AppState,
        SetState<AppState>,
        GetState<AppState>,
        StoreApiWithSubscribeWithSelector<AppState> &
          StoreApiWithPersist<AppState>
      >(
        (set, get) => ({
            navRef: createRef(),
            animRef: createRef(),
            view: {current: 'landing', next: 'none'},
            token: '',
            setView: (view: View) => set ({view: view}),
            setToken: (token: string) => set ({token: token})
        }),
        { name: 'name', getStorage: ()=> localStorage, partialize: (state) => ({token: state.token}) }
      )
    )
  )

// export const useStore = create<AppState, SetState<AppState>, SetState<AppState>, StoreApiWithPersist<AppState>>(
//     persist((set, get) =>({
//         navRef: createRef(),
//         animRef: createRef(),
//         view: {current: 'landing', next: 'none'},
//         token: '',
//         setView: (view: View) => { set ({view: view})},
//         setToken: (token: string) => { set ({token: token})}
//     }), {name: "123"}
// ),)

// export const useStore = create<AppState>((set: SetState<AppState>, get: GetState<AppState>) => ({
//     loggedIn: false,
//     navRef: createRef(),
//     animRef: createRef(),
//     view: {current: 'landing', next: 'none'},
//     token: '',
//     setView: (view: View) => { set ({view: view})},
//     setToken: (token: string) => { set ({token: token})}
//     // setNavRef: (navRef: MutableRefObject<HTMLDivElement>) => {set ({navRef: navRef})},
//     // setMainRef: (mainRef: MutableRefObject<HTMLDivElement>) => {set ({mainRef: mainRef})},
//     // menu: {view: 'browse'},
//     // update: false,
//     // inQueue: 0,
//     // setMenu: (newMenu:Menu):void => {set({menu: newMenu})},
//     // setUpdate: () => {set((state) => ({update: !state.update}))},
//     // updateQueue: (num: number) => {set((state) => ({inQueue: num }))}
// }))


// export const useStore = create(
//     persist(
//         (set, get) => ({
//             navRef: createRef(),
//             animRef: createRef(),
//             view: {current: 'landing', next: 'none'},
//             token: '123',
//             setView: (view: View) =>  set ((state) => ({view: view})),
//             setToken: (token: string) =>  set ({token: token})
//         }), {name: "test-store"})
// )