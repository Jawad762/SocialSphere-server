import Tweet from '../models/Tweet.js'
import User from '../models/User.js'

export const createTweet = async (req, res, next) => {
    try {
        const tweet = new Tweet(req.body)
        await tweet.save()
        res.status(200).json(tweet)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const deleteTweet = async (req, res, next) => {
    try {
        await Tweet.findByIdAndDelete(req.params.id)
        res.status(200).json('Tweet has been deleted.')
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const likeOrUnlikeTweet = async (req, res, next) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
        const likerId = req.body.id

        if (tweet.likes.includes(likerId)) {
            tweet.likes.pull(likerId)
            await tweet.save()
            res.status(200).send('Unliked tweet.')   
        }
        
        else {
            tweet.likes.push(likerId)
            await tweet.save()
            res.status(200).send('Liked tweet.')
        } 

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getTweet = async (req, res, next) => {
    try {
        const { id } = req.params
        const tweet = await Tweet.findById(id)
        res.status(200).json(tweet)
    } catch (error) {
        next(error)
    }
}

export const getTimelineTweets = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        const followingTweets = await Promise.all(
            user.following.map(id => {
            return Tweet.find({ userId: id }).sort({createdAt: -1})
        })
        )

        res.status(200).json([].concat(...followingTweets))
    } catch (error) {
        next(error)
    }
}

export const getUserTweets = async (req, res, next) => {
    try {
        const tweets = await Tweet.find({ userId: req.params.id }).sort({
            createdAt: -1
        })
        res.status(200).json(tweets)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getExploreTweets = async (req, res, next) => {
    try {
        const tweets = await Tweet.find().sort({
            createdAt: -1
        })
        res.status(200).json(tweets)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export const getLikedTweets = async (req, res, next) => {
    try {
        const { userId } = req.params
        const likedTweets = await Tweet.find({ userId })
        res.status(200).json(likedTweets)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}