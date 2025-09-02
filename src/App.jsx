import MainRoutes from "./routes/MainRoutes"
import Navbar from "./components/Navbar"
import './index.css'
import style from '../src/styles/App.module.scss';
const App = () => {
  return (
    <div className={style.container}>
      <Navbar />
      <MainRoutes />
    </div>
  )
}

export default App