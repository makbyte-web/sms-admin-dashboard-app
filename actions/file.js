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
    const file = formData.get(name);

    if (file instanceof File) {
      const result = await uploadFiletoCloud(file, { asset_folder: `sms-admin-dashboard/${folder}`, public_id: `${id}` })

      // code to return URL
      if (result) return result
    }
  }
  catch (error) {
    console.log("Error in acceptFileToUpload:", error)
  }
};

export const deleteCloudinaryImage = async (public_id) => {
  if (!public_id) return;

  try {
    const result = await cloud.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.log("Error in deleteCloudinaryImage:", error);
  }
};

export const deleteCloudinaryFolder = async (folderPath) => {
  if (!folderPath) return;

  try {
    // 1. Delete all assets within the folder (and sub-folders)
    const deleteAssetsResult = await cloud.api.delete_resources_by_prefix(`${folderPath}`,
      {
        resource_type: 'image', // Specify resource_type (image, video, or raw)
        invalidate: true, // Invalidate assets on the CDN
      }
    );
    console.log(`Assets within ${folderPath} got deleted:`, deleteAssetsResult);

    // Repeat the delete_resources_by_prefix for other resource types (video, raw) if necessary
    // await cloud.api.delete_resources_by_prefix(`${folderPath}`, { resource_type: 'video' });
    // await cloud.api.delete_resources_by_prefix(`${folderPath}`, { resource_type: 'raw' });

    // 2. Delete the now-empty folder
    const deleteFolderResult = await cloud.api.delete_folder(`${folderPath}`);
    console.log(`Folder related to School located at : ${folderPath} is deleted:`, deleteFolderResult);

  } catch (error) {
    console.error("Error in deleteCloudinaryFolder while deleting folder and assets:", error);
  }
}
