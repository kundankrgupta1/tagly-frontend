import { useLocation } from "react-router-dom"
import Navbar from "./Components/Navbar"
import AllRoutes from "./routes/AllRoutes"
export const SERVER_URI = "http://localhost:3000";

const App = () => {
	const location = useLocation();
	const hidePaths = ["/api/v1/user/auth"]
	const hideComponents = hidePaths.includes(location.pathname);

	return (
		<div className="max-w-[1000px] m-auto montserrat">
			{!hideComponents && <Navbar />}
			<AllRoutes />
		</div>
	)
}

export default App;