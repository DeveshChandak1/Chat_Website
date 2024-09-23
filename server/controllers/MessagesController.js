import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    // Debugging logs
    //   console.log("User 1:", user1);
    //   console.log("User 2:", user2);

    if (!user1 || !user2) {
      return response.status(400).send("Both user Id's are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    // Check what messages are being returned
    //   console.log("Fetched Messages:", messages);

    return response.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is Required");
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(request.file.path, fileName);

    return response.status(200).json({ filePath: fileName });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};