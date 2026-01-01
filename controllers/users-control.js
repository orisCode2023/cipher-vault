import { ObjectId } from "bson";
import { count } from "node:console";

// Create todo
export const createUser = async (req, res) => {
  try {
    const {username, password} = req.body
    const mongoConn = req.mongoConn;
    const usersCollection = mongoConn.collection('usres');

    const newUser = {
      username,
      password,
      encryptedMessagesCount: 0,
      created_at: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    await usersCollection.findOne({ _id: new ObjectId(result.insertedId) });
    res.status(201).json({ msg: "success", data: { "id": result.insertedId, "username": username } });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({
        msg: "error",
        data: null,
        message: "A user with this username already exists",
      });
    }
    res.status(500).json({ msg: "error: " + err.message, data: null });
  }
};


export const authUser = async (req, res) => {
    const db = req.mongoDbConn;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ 
        username: username, password: password
    });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    } else {
        return res.status(200).json({username :user.username, countMessages: user.encryptedMessagesCount})
    }
}