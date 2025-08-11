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
    <button onClick={() => handleClick(RandomLocation)}>適当な座標を送信</button>
    <button onClick={() => handleClick(Error)}>空の座標を送信</button>
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
    loaderUrl: "../../Build/Build.loader.js",
    dataUrl: "../../Build/Build.data",
    frameworkUrl: "../../Build/Build.framework.js",
    codeUrl: "../../Build/Build.wasm",
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

