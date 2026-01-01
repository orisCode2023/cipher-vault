import { ObjectId } from "bson";

function encrypt(text){
    let result = text.toUpperCase()
    return result.split('').reverse().join('');
}
console.log(encrypt("my name "))
function decrypt(text){
    let result = text.toLowerCase()
    return result.split('').reverse().join('');
}
console.log(decrypt(encrypt("my name ")))


export const encryptMessage = async (req, res) => {
  try {
    const {username, password, messageToEncrypt, cipher_type} = req.body
    const db = req.mongoDbConn;
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ 
        username: username, password: password
    });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    } 
    const mysqlConn = req.mysqlConn;
    const newMessage = {
      username,
      cipher_type,
      encrypted_text : encrypt(messageToEncrypt),
      inserted_at: new Date()
    };

    const [ResultSetHeader] = await mysqlConn.query(
      "INSERT INTO messages (username, cipher_type, encrypted_text, inserted_at) VALUES (?, ?, ?, ?)",
      [
        newMessage.username,
        newMessage.cipher_type,
        newMessage.encrypted_text,
        newMessage.inserted_at,
      ]
    );

    const [message] = await mysqlConn.query("SELECT * FROM messages WHERE id = ?", [ResultSetHeader.insertId]);
    
    await usersCollection.updateOne(
      { username:newMessage.username },           
      { $inc: { encryptedMessagesCount: 1 } }          
    );
    res.status(201).json({ msg: "success", data: {id: message[0].id, cipher_type: message[0].cipher_type} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};


export const decryptMessage = async (req, res) => {
  try {
    const {username, password, messageId} = req.body
    const db = req.mongoDbConn;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ 
        username: username, password: password
    });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    const mysqlConn = req.mysqlConn;
    
    const message = await mysqlConn.query("SELECT * FROM messages WHERE id = ?", [messageId]);
    
    console.log(message)
    const decryptMessage = decrypt(message.encrypted_text)
    res.status(200).json({ msg: "success", data: {id: messageId, text: decryptMessage} });
  } catch (err) {
    console.error(err);
    res.status(200).json({ msg: "CONNOT DECRYPT" + err.message, data: {id: messageId, text: null}});
  }
};