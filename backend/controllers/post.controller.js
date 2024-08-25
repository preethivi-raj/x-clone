import User from "../models/user.model.js";
import Post from "../models/post.model.js"
import { v2 as cloudinary}  from "cloudinary"
import Notification from "../models/notification.model.js";

export const createPost = async(req , res)=>{
    try {
        const {text}= req.body;
        let {img} = req.body;
        const userId =req.user._id.toString();
        const user = await User.findById( userId)
        if(!user){
            return res.status(404).json({message:"404 Not User Found"})
        }

        if(!text && !img){
            return res.status(400).json({error: "Post must have text or Image"})
        }

        if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

        const newPost =new Post( {
            user : userId,
            text :text ,
            img   
        })

        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        console.log(`Error in create post : ${error.message}`)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const deletePost = async (req ,res)=>{
    try {
        const id = req.params.id;
        const post =await Post.findById({_id : id});
        
        
        if(!post){
            return res.status(404).json({Error : "Post Not Found" })
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({Error: "You ara not authorized to delete this podt"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({message : "Post Delete Successfully"});

    } catch (error) {
        console.log(`Error in Delete Post Controller: ${error}`)
        res.status(500).json({ message : "Internal Server Error"})
    }
}

export const commentOnPost = async (req , res)=>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({Error :"Text Filed is required"})
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({Error : "Post Not Found"})
        }

        const comment = {
            user : userId,
            text
        }

        post.comments.push(comment)

        await post.save();

        res.status(200).json(post)

    } catch (error) {
        console.log(`Error in comment on Post Controller: ${error}`)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const likeUnlikePost = async(req ,res)=>{
    try {
		const userId = req.user._id;
		const { id: postId } = req.params;

       

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);
       
		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            
			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());    
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getAllPosts = async(req , res)=>{
    try {
        const posts = await Post.find().sort({createdAt : -1}).populate({
            path :"user",
            select : "-password"
        }).populate({
            path:"comments.user",
            select : "-password"
        })

        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts)
    } catch (error) {
        console.log(`Error in get all posts Controller: ${error}`)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const getLikedPosts = async (req , res)=>{
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({Error: 'User Not Found'})
        }

        const likedPosts = await Post.find({_id : {$in : user.likedPosts}}).populate({
            path :"user",
            select : "-password"
        }).populate({
            path:"comments.user",
            select : "-password"
        })

        res.status(200).json(likedPosts)
    } catch (error) {
        console.log(`Error in get liked posts Controller: ${error}`)
        res.status(500).json({message : "Internal Server Error"})      
    }
}

export const getFollowingPosts = async (req , res)=>{
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({Error : "User Not Found"})
        }

        const following = user.following;

        const feedPosts = await Post.find({user: {$in : following}})
        .sort({createdAt :-1})
        .populate({
            path :"user",
            select : "-password"
        }).populate({
            path:"comments.user",
            select : "-password"
        })

        res.status(200).json(feedPosts)
    } catch (error) {
        console.log(`Error in get Following posts Controller: ${error}`)
        res.status(500).json({message : "Internal Server Error"})     
    }
}

export const getUserPosts = async(req , res)=>{
    try {
        const {username} = req.params.username;

        const user = await User.find({username : username})

        if(!user){
            return res.status(404).json({Error :"User Not Found"})
        }

        const posts = await Post.find({user : user._id})
        .sort({createdAt : -1})
        .populate({
            path :"user",
            select : "-password"
        }).populate({
            path:"comments.user",
            select : "-password"
        })

        res.status(200).json(posts);
    } catch (error) {
        console.log(`Error in get user posts Controller: ${error}`)
        res.status(500).json({message : "Internal Server Error"}) 
    }
}