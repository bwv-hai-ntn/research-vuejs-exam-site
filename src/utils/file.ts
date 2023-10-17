import * as AWS from 'aws-sdk';
import { Request } from 'express';
import * as moment from 'moment-timezone';
import * as Url from 'url';

/**
 * Upload file to AWS S3
 * @param req
 * @param recordId
 * @param dir directory to save file in S3
 * @param prefix
 * @return filePath or null
 */
export async function s3FileUpload(
  req: Request,
  key: string
): Promise<string | null> {
  if (req.file !== undefined) {
    AWS.config.update({
      credentials: {
        accessKeyId: <string>process.env.AWS_IAM_ID,
        secretAccessKey: <string>process.env.AWS_IAM_ACCESS_KEY
      },
      region: <string>process.env.AWS_REGION
    });

    const fileName = req.file.originalname;
    const date = moment().tz('Asia/Ho_Chi_Minh');

    const path = `${key}/${fileName.slice(
      0,
      fileName.lastIndexOf('.')
    )}_${date.format('YYYYMMDDHHmmss')}${fileName.slice(
      fileName.lastIndexOf('.')
    )}`;

    const s3 = new AWS.S3();
    try {
      // upload image to s3 bucket
      await s3
        .putObject({
          Bucket: <string>process.env.S3_BUCKET,
          Key: path,
          Body: req.file.buffer
        })
        .promise();

      return s3.getSignedUrl('getObject', {
        Bucket: <string>process.env.S3_BUCKET,
        Expires: 86400 * 3650, // 3650 days
        Key: path,
        ResponseContentDisposition: 'attachment'
      });
    } catch (err) {
      throw err;
    }
  }
  return null;
}

/**
 * delete old file in S3 server
 * @param file
 * @param bucket
 * @return boolean
 */
export async function deleteExistFileS3(
  file: string | undefined,
  bucket?: string
) {
  if (file === undefined || file == null) {
    return;
  }
  AWS.config.update({
    credentials: {
      accessKeyId: <string>process.env.AWS_IAM_ID,
      secretAccessKey: <string>process.env.AWS_IAM_ACCESS_KEY
    },
    region: <string>process.env.AWS_REGION
  });
  const s3 = new AWS.S3();
  let key = Url.parse(file).pathname;
  key = decodeURIComponent(key!.slice(1, key!.length));
  try {
    await s3
      .deleteObject({
        Bucket: bucket ? bucket : <string>process.env.S3_BUCKET,
        Key: key
      })
      .promise();
  } catch (error) {
    throw error;
  }
}
