import { useEffect, useState } from "react"
import { useStore } from "../store"

export const AppHome = ():JSX.Element => {

    const [url, setUrl] = useState('')
    const token = useStore(state => state.token)

    useEffect(() => {
        getVideo()
    }, [token])

    const getVideo = () => {
        console.log(token)
        const source = 'https://localhost:7227/api/Videos/PlayVideo'
        const options = {
          headers: {
              Authorization: `Bearer ${token}`
          }
        }
        fetch(source, options)
          .then(response => response.blob())
          .then(blob => {
              setUrl(URL.createObjectURL(blob))
          })
    }

    return <div className="main-content-container">
        <div className="preview-video">
            <h3>Test Video</h3>
            <video controls src={url}></video>
            <span>TAGS</span>
        </div>
        {/* <div className="preview-video">
            <h3>Test Video</h3>
            <video controls src={url}></video>
            <span>TAGS</span>
        </div> */}
    </div>
}

{/* <video controls src={url}></video> */}







// const source = 'http://example.com/cors-enabled-video.mp4'
// const options = {
//   headers: {
//       Authorization: 'Basic blahblahblah'
//   }
// }
// fetch(source, options)
//   .then(response => response.blob())
//   .then(blob => {
//       this.setState({
//       url: URL.createObjectURL(blob)
//     })
//   })

// const token = getUserToken();
// const CustomVideo = ({ videoUrl }) => {
//     const options = {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }
//     const [url, setUrl] = useState()
//     useEffect(() => {
//         fetch(videoUrl, options)
//         .then(response => response.blob())
//             .then(blob => {
//             setUrl(URL.createObjectURL(blob))

//         });
//     }, [videoUrl])


//     return (
//         <ReactPlayer url={url} width="100%"  controls />
//     )
// }