import type { NextPage } from 'next'
import { AppHome } from '../src/components/AppHome'
import { Menu } from '../src/components/Menu'
import { AppHeader } from '../src/components/AppHeader'
import { useStore } from '../src/store'

const Service: NextPage = () => {



    return <div className='service-container'>

        <div className='mainarea-container'>
            <AppHeader/>
            <AppHome/>
            <Menu/>
        </div>
    </div>
}

export default Service