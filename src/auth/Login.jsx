import { useContext, useState } from "react";
import { Input } from "../Components/InputFeild"
import { IoMdLogIn } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Button from "../Components/Button";
import axios from "axios";
import { SERVER_URI } from "../App";
import { ContextAPI } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

const Login = () => {
	const { setIsAuth, setToken, setLoggedInUser, setProfilePicture, setUsername } = useContext(ContextAPI);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [popup, setPopup] = useState(false);
	const handleLogin = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		if (!otpSent) {
			try {
				const res = await axios.post(`${SERVER_URI}/login`, { email, password });
				if (res.data.success) {
					setIsLoading(false);
					setMessage(res.data.message);
					setPopup(true);
				}
				setTimeout(() => {
					if (res.data.success) {
						setOtpSent(true);
						setMessage("")
						setPopup(false);
					}
				}, 2000);
			} catch (error) {
				setIsLoading(false);
				setError(error.response.data.message);
				setPopup(true);
				setTimeout(() => {
					setPopup(false);
					setError("");
				}, 2000);
			}
		} else {
			try {
				const res = await axios.post(`${SERVER_URI}/otp`, { email, otp });
				if(res.data.loginRequired){
					setIsLoading(false);
					setMessage(res.data.message);
					setPopup(true);
				}
				setTimeout(() => {
					if(res.data.loginRequired){
						setMessage("");
						setPopup(false);
						setOtpSent(false);
					}
				}, 2000);
				if (!res.data.loginRequired && res.data.success) {
					setIsLoading(false);
					setPopup(true);
					setMessage(res.data.message);
					setToken(res.data.token);
					setLoggedInUser(res.data.user._id);
					setProfilePicture(res.data.user.profilePicture);
					setUsername(res.data.user.username);
					setIsAuth(true);
					localStorage.setItem("token", res.data.token);
					localStorage.setItem("loggedInUser", res.data.user._id);
					localStorage.setItem("profilePicture", res.data.user.profilePicture);
					localStorage.setItem("username", res.data.user.username);
				}
				setTimeout(() => {
					if (!res.data.loginRequired && res.data.success) {
						setOtpSent(false);
						setMessage("")
						setPopup(false);
						navigate("/");
					}
				}, 2000);
			} catch (error) {
				setIsLoading(false);
				setError(error.response.data.message);
				setPopup(true);
				setTimeout(() => {
					setError("");
					setPopup(false);
				}, 2000);
			}
		}

	}
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl font-bold text-center mb-4">{!otpSent ? "Login" : "Verify"}</h1>
			<form onSubmit={handleLogin} className="flex flex-col gap-4">
				{!otpSent && <Input
					type="email"
					value={email}
					placeholder="Email"
					required={true}
					onChange={(e) => setEmail(e.target.value)}
				/>}
				{!otpSent ?
					<Input
						type="password"
						value={password}
						placeholder="Password"
						required={true}
						onChange={(e) => setPassword(e.target.value)}
					/>
					:
					<Input
						type="text"
						value={otp}
						placeholder="Enter OTP"
						required={true}
						onChange={(e) => setOtp(e.target.value)}
					/>}
				{!otpSent ?
					<Button
						type="submit"
						icon={!isLoading && <IoMdLogIn size={"1.5rem"} />}
						text={isLoading ? <Loading text={"OTP sending..."} /> : "login"}
						style={"capitalize w-fit border-2 border-blue-600 text-white"}
					/>
					:
					<Button
						type="submit"
						icon={!isLoading && <FaCheck size={"1.5rem"} />}
						text={isLoading ? <Loading text={"verifying..."} /> : "verify"}
						style={"capitalize w-fit border-2 border-blue-600 text-white"}
					/>
				}
			</form>
			{
				popup &&
				(
					<div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
						<div
							className={`transform transition-transform duration-300 ease-in-out ${popup ? 'translate-y-0' : 'translate-y-full'
								} ${message ? "bg-green-300" : error ? "bg-red-300" : "bg-white"} p-6 shadow-lg rounded-t-lg w-full max-w-md sm:max-w-lg`}
						>
							{message && (
								<div className="w-fit mt-4 bg-green-300 rounded-sm text-black px-3 py-1">
									<p className="text-center">{message}</p>
								</div>
							)}
							{error && (
								<div className="w-fit mt-4 bg-red-300 rounded-sm text-black px-3 py-1">
									<p className="text-center">{error}</p>
								</div>
							)}
						</div>
					</div>
				)
			}
		</div>
	)
}

export default Login