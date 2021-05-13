import S3 from 'aws-sdk/clients/s3'
import s3config from '../s3config'
import fs from 'fs' 

// uploads a file to s3

const region = s3config.region;
const accessKeyId = s3config.accessKeyId;
const secretAccessKey = s3config.secretAccessKey;
const bucketName = s3config.bucketName;

const s3 = new S3({
   region,
   accessKeyId,
   secretAccessKey
});

export function uploadFile(path, filename){

   var fileStream = fs.createReadStream(path);
   
   const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: filename
   }

   return s3.upload(uploadParams).promise();

}
