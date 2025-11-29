import BottomNavBar from "./componnent/BottomNavBar"

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Settings from "./pages/Settings"
import Stats from "./pages/Stats"

import { useSelector } from "react-redux";

function App() {

  const activePage = useSelector((state) => state.navBar.activeTab);
  console.log(activePage)

  return (
    <>

      {activePage === "home" && <Home />}
      {activePage === "lists" && <Lists />}
      {activePage === "stats" && <Stats />}
      {activePage === "settings" && <Settings />}
      
      <BottomNavBar />
    </>
  )

}

export default App
