import { Unity, useUnityContext} from "react-unity-webgl";
import '../CSS/UnityBuild.css';
import UnityMessageDisplay from "../components/UnityMessageDisplay"
import GetLocation from "../components/GetLocation"
import GetDirection from "../components/GetDirection"

const RandomLocation = "12,12"
const Error = "";

// sendMessageプロップの型定義
interface UnityButtonProps {
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter: string
  ) => void;
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
    loaderUrl: "../../Build/54c707f8f74796c1b22158ff640ef3b7.loader.js",
    dataUrl: "../../Build/81ba31f2fef3fc7aec33b79d2e84d79e.date",
    frameworkUrl: "../../Build/d9661d51b1e138b59964585efd47b10a.framework.js",
    codeUrl: "../../Build/3a35eb2958e942bd069bcb9a514adb14.wasm",
  })
  return(
  <>

  <div>
  <Header/>
  <UnityButton sendMessage={sendMessage}/>
  <Unity unityProvider={unityProvider} className="unity-canvas-large-and-centered"/>
  <UnityMessageDisplay />
  <GetLocation sendMessage={sendMessage}/>
  <GetDirection />
  </div> 

  </>
  )}

export default MapGuidance

