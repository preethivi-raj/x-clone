import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import baseUrl from "../../baseUrl/baseUrl";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {
	const getPostEndPoint = (feedType)=>{
		switch(feedType){
			case 'forYou':
				return `${baseUrl}/api/posts/all`;
			case 'following':
				return `${baseUrl}/api/posts/follwing`;
			default:
				return `${baseUrl}/api/posts/all`;
		}
	}

	const POST_ENDPOINT = getPostEndPoint(feedType);

	const {data:posts,isLoading , refetch,isRefetching} =useQuery({
		queryKey: ['posts'],
		queryFn: async ()=>{
			try {
				const res= await fetch(POST_ENDPOINT,{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.message || 'Something went wrong');
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		}
	})
	useEffect( ()=>{
		refetch();
	},[feedType, refetch])


	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;