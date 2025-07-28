import { Unity, useUnityContext} from "react-unity-webgl";
import '../CSS/UnityBuild.css';

// sendMessageプロップの型定義
interface UnityButtonProps {
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter: number 
  ) => void;
}

//ボタンをクリックしてキューブを移動
const UnityButton = ({sendMessage}:UnityButtonProps) => {
  function handleClick(position: number){
    sendMessage("Ball","Move",position);
  }
  return(
    <>
    <button onClick={() => handleClick(-1)}>左へ移動</button>
    <button onClick={() => handleClick(1)}>右へ移動</button>
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
  </div> 

  </>
  )}

export default MapGuidance

