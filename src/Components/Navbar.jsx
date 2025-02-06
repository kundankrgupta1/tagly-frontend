import { Link, useNavigate } from "react-router-dom"
import Logo from "./Logo"
import Button from "./Button";
import { useContext } from "react";
import { ContextAPI } from "../context/ContextProvider";
import { IoMdLogIn } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuth, loggedInUser, profilePicture, username } = useContext(ContextAPI);
	return (
		<>
			<div className="px-4 py-3 flex items-center justify-between border-b mb-4"
				style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
			>
				<Link to={"/"}>
					<Logo />
				</Link>
				<div className="flex items-center gap-4">
					{isAuth && <Button
						icon={<FiPlusCircle size={"1.5rem"} />}
						text={"create post"}
						style={"capitalize border-2 border-blue-600 text-white"}
						onClick={() => navigate("/create")}
					/>}
					{isAuth && <Link to={`/api/v1/user/profile/${loggedInUser}`}>
						<Button
							img={profilePicture ? profilePicture : "https://tinyurl.com/5paj2hrp"}
							text={username}
							style={"border-2 border-blue-600 text-white"}
						/>
					</Link>}
					{!isAuth &&
						<Link to={"/api/v1/user/auth"}>
							<Button
								icon={<IoMdLogIn size={"1.5rem"} />}
								text={"login"}
								style={"capitalize  border-2 border-blue-600 text-white"}
							/>
						</Link>
					}
				</div>
			</div>

		</>
	)
}

export default Navbar;