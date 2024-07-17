import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    res.status(201).json({ newPost, message: "post created successfully" });
  } catch (error) {
    res.status(409).json({ msg: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.findById({ userId: userId });

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

//UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // id of the post
    const { userId } = req.body; // id of the user

    if (!userId || typeof userId !== "string") {
      throw new Error("userId must be a defined string");
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Ensure likes is initialized as a Map
    if (!post.likes) {
      post.likes = new Map();
    }

    const isLiked = post.likes.get(userId);
    console.log("isLiked:", isLiked); // Debugging statement

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    console.log("Updated like status:", post.likes.get(userId)); // Debugging statement

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

// get post by Id

export const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found", });
    }
    res.status(200).json({post});
  } catch (error) {
    res.status(404).json({ message: `Post not found, ${error.message} ` });
  }
};


export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;  // id of the post
    const { userId, comment } = req.body;  // userId and comment

    // Ensure userId and comment are provided
    if (!userId || !comment) {
      throw new Error("userId and comment must be provided");
    }

    // Fetch the user to get firstName and lastName
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Add the comment to the post
    const newComment = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      comment: comment,
      createdAt: new Date(),
    };
    post.comments.push(newComment);

    // Save the updated post
    const updatedPost = await post.save();
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;  // id of the post

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ msg: "Post not found" });
    }
    
    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentIndex } = req.params;  // postId of the post, commentIndex of the comment

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Validate commentIndex
    if (commentIndex < 0 || commentIndex >= post.comments.length) {
      return res.status(404).json({ msg: "Invalid comment index" });
    }

    // Remove the comment from the array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await post.save();

    res.status(200).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
