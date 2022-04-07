import { Browse, Playlist, Discussion } from "../svgicons"

export const Menu = () => {

    const positions = [
        'GUARD',
        'PASSING',
        'PINS',
        'ESCAPES',
        'SUBMISSIONS'
    ]

    const menuIconText = [
        'VIDEOS',
        'LISTS',
        'FORUM'
    ]

    const menu = [
        Browse,
        Playlist,
        Discussion
    ]

    return <div className='positions-container'>
        {menu.map((item, index) => {
            return <div key={index} className="menu-item-container">
                {item()}
                <span className="menu-item-text">{menuIconText[index]}</span>
            </div>
        })}
    </div>
}