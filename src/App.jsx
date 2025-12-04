import BottomNavBar from "./componnent/BottomNavBar"
import ToastContainer from "./componnent/ToastContainer"

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Settings from "./pages/Settings"
import Stats from "./pages/Stats"

import { useSelector } from "react-redux";

function App() {

  const activePage = useSelector((state) => state.navBar.activeTab);
  const isTrainingMode = useSelector((state) => state.lists.isTrainingMode);
  console.log(activePage)

  return (
    <>
      <div className="pb-24">
        {activePage === "home" && <Home />}
        {activePage === "lists" && <Lists />}
        {activePage === "stats" && <Stats />}
        {activePage === "settings" && <Settings />}
      </div>

      {!isTrainingMode && <BottomNavBar />}
      <ToastContainer />
    </>
  )

}

export default App
