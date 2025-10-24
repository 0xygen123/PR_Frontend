import { Unity, useUnityContext} from "react-unity-webgl";
import '../CSS/UnityBuild.css';
import UnityMessageDisplay from "../components/UnityMessageDisplay"
import GetLocation from "../components/GetLocation"
import GetDirection from "../components/GetDirection"
//import { Button } from "./ui/button";

const RandomLocation = "12,12"
const Error = "";
const destinationPosition = "student_hall,1b";

// sendMessageプロップの型定義
interface UnityButtonProps {
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter: string
  ) => void;
}


//ボタンをクリックして目的地を送信
const Destination = ({sendMessage}:UnityButtonProps) => {
  function DestinationClick(destination:string){
    sendMessage("JSInterface","PathfindingRequested",destination);
  }

  return(
    <>
    <button
      onClick={() => DestinationClick(destinationPosition)}
      className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground">
      目的地を送信
    </button>
    </>
  )
}

//ボタンをクリックしてキューブを移動
const UnityButton = ({sendMessage}:UnityButtonProps) => {
  function handleClick(position: string){
    sendMessage("JSInterface","SetLocation",position);
  }
  return(
    <>
    <button 
      onClick={() => handleClick(RandomLocation)}
      className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground">
      適当な座標を送信
    </button>
    <button
      onClick={() => handleClick(Error)}
      className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground">
      空の座標を送信
    </button>
    </>
  )
}

//ヘッダー
const Header = () =>{
  return(
  <div>
    <p>Mix Leap 2025/07/28</p>
  </div>
  )}


const MapGuidance = () => {
    const { unityProvider ,sendMessage} = useUnityContext({
        loaderUrl: "/Build/3517d7a01a316e5bf9186dfad0c60e87.loader.js",
        dataUrl: "/Build/72b8084547a26c4d11625e36e4ebec30.data",
        frameworkUrl: "/Build/44fdf7c87db8aaf4789a6cc8968a3b46.framework.js",
        codeUrl: "/Build/7e5429539ecbb895932239683ce6971a.wasm",
  })
  return(
  <>

  <div>
  <Header/>
  <Destination sendMessage={sendMessage}></Destination>
  <UnityButton sendMessage={sendMessage}/>
  <Unity unityProvider={unityProvider} className="unity-canvas-large-and-centered"/>
  <UnityMessageDisplay />
  <GetLocation sendMessage={sendMessage}/>
  <GetDirection />
  
  </div> 

  </>
  )}

export default MapGuidance

