function encrypt(text){
    let result = text.toUpperCase()
    return result.split('').reverse().join('');
}

function decrypt(text){
    let result = text.toLowerCase()
    return result.split('').reverse().join('');
}



export const encryptMessage = async (req, res) => {
  try {
    const {username, password, messageToEncrypt, cipher_type} = req.body
    const db = req.mongoDbConn;
    const usersCollection = db.collection('users');
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

    const [result] = await mysqlConn.query(
      "INSERT INTO messages (username, cipher_type, encrypted_text, inserted_at) VALUES (?, ?, ?, ?)",
      [
        newMessage.username,
        newMessage.cipher_type,
        newMessage.encrypted_text,
        newMessage.inserted_at,
      ]
    );

    const [message] = await mysqlConn.query("SELECT * FROM messages WHERE id = ?", [result.insertId]);
    await usersCollection.updateOne(
      { _id: new ObjectId(result.insertId) },           
      { $inc: { encryptedMessagesCount: 1 } }          
    );
    res.status(201).json({ msg: "success", data: message });
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
    const decryptMessage = decrypt(message.encrypted_text)
    res.status(200).json({ msg: "success", data: {id: messageId, text: decryptMessage} });
  } catch (err) {
    console.error(err);
    res.status(200).json({ msg: "CONNOT DECRYPT" + err.message, data: {id: messageId, text: null}});
  }
};