import { useContext, useEffect, useState } from "react"
import SinglePost from "./SinglePost"
import { ContextAPI } from "../context/ContextProvider"
import Loading from "../Components/Loading"
import axios from "axios"
import { SERVER_URI } from "../App"

const AllPosts = () => {
	const { token, UserLogout } = useContext(ContextAPI)
	const [allPost, setAllPost] = useState([])
	const [isLoadingForAllPosts, setIsLoadingforAllPosts] = useState(false)
	const [errorForAllPosts, setErrorForAllPosts] = useState(false)
	const getPosts = async () => {
		setIsLoadingforAllPosts(true)
		if (!token) {
			setErrorForAllPosts("Please login first!!!")
			return;
		}
		try {
			const res = await axios.get(`${SERVER_URI}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			setAllPost(res.data.allPost)
			setIsLoadingforAllPosts(false)
		} catch (error) {
			console.log("error from all post", error)
			if (error.response.status === 401 && error.response.data.message === "TokenExpiredError: jwt expired") {
				setErrorForAllPosts("Session expired, please login again!!!")
				setIsLoadingforAllPosts(false)
			}
			setTimeout(() => {
				if (error.response.status === 401 && error.response.data.message === "TokenExpiredError: jwt expired") {
					UserLogout();
				}
			}, 2000)
			setErrorForAllPosts(error.response?.data?.message || "server error!!!")
			setIsLoadingforAllPosts(false)
		}
	}
	useEffect(() => {
		getPosts();
	}, [])

	return (
		<>
			{isLoadingForAllPosts && <div className="flex items-center justify-center h-screen"><Loading text="Loading posts..." /></div>}
			{errorForAllPosts && <p>error</p>}
			{!isLoadingForAllPosts && !errorForAllPosts && (
				<>
					{allPost?.length > 0 ? (
						allPost
							.slice()
							.reverse()
							.map((post) => (
								<SinglePost key={post._id} {...post} />
							))
					) : (
						<p className="text-center">No posts found</p>
					)}
				</>
			)}
		</>
	)
}

export default AllPosts;
