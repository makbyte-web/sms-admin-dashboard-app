"use server";
import { v2 as cloud } from "cloudinary";
import streamifier from "streamifier";

cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadFiletoCloud = async (file, options) => {

  if (file.size <= 0) return;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    const stream = cloud.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error.message);
      
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  })
}

export const acceptFileToUpload = async (formData, name, id, folder) => {
  try {
    // console.log("In acceptFileToUpload", formData, name, id, folder);

    const file = formData.get(name);
    // console.log('FILE:',file)

    if (file instanceof File) {
      const result = await uploadFiletoCloud(file, {asset_folder: `sms-admin-dashboard/${folder}`, public_id: `${id}`})

      // code to return URL
      // console.log('after upload:',  result)
      if (result) return result

    }
  }
  catch(error) {
    console.log(`Error in acceptFileToUpload ${error}`)
  }
};
