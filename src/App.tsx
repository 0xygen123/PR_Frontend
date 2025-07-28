import './App.css'
import { BrowserRouter, Routes, Route ,Link} from 'react-router-dom';
import Page1 from './Pages/Page1'
import Page2 from './Pages/Page2'
import Page3 from './Pages/Page3'
import MapGuidance from './Pages/Unity'

function App() {

  return (
    <>
    <div>
    <BrowserRouter>
      <header>
        <nav>
          <Link to="/Pages/Page1">Page1</Link> | <Link to="/Pages/Page2">Page2</Link> | <Link to="/Pages/Page3">Page3</Link> | <Link to="/Pages/Unity">MapGuidance</Link>
        </nav>
      </header>

      <hr />

      {/*ルーティング設定*/}
      <main>
        <Routes>
          <Route path="/Pages/Page1" element={<Page1 />} />
          <Route path="/Pages/Page2" element={<Page2 />} />
          <Route path="/Pages/Page3" element={<Page3 />} />
          <Route path="/Pages/Unity" element={<MapGuidance />} />
        </Routes>
      </main>
    </BrowserRouter>
    </div>
    {/*ルーティング設定ここまで*/}

    </>
    
  )
}

export default App
