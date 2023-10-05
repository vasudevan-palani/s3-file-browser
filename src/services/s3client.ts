const AWS = require("aws-sdk");
import Credentials from "./aws";
class S3Client {
  _s3Client: any;
  constructor() {
    this.init();
  }

  init() {
    if (Credentials.getSessionToken() != undefined) {
      AWS.config.update({
        accessKeyId: Credentials.getAccessKey(),
        secretAccessKey: Credentials.getSecretKey(),
        sessionToken: Credentials.getSessionToken(),
      });
    } else {
      AWS.config.update({
        accessKeyId: Credentials.getAccessKey(),
        secretAccessKey: Credentials.getSecretKey(),
      });
    }

    this._s3Client = new AWS.S3();
  }

  getBuckets() {
    this.init();
    return new Promise((resolve, reject) => {
      this._s3Client.listBuckets({}, (err: any, data: any) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(data);
        let childItems = [];

        for (let i = 0; i < data.Buckets.length; i++) {
          childItems.push({ Name: data.Buckets[i].Name, isLeaf: false });
        }
        resolve(childItems);
      });
    });
  }

  getItems(s3bucket: string, s3prefix: string, continuationToken: string) {
    this.init();

    let params: any = {
      Bucket: s3bucket,
    };
    if (
      s3prefix != String(undefined) &&
      s3prefix != "" &&
      s3prefix != undefined
    ) {
      params["Prefix"] = s3prefix;
    }

    if (continuationToken != "") {
      params["ContinuationToken"] = continuationToken;
    }
    console.log(params);

    let hasMore = false;
    let nextToken = "";

    return new Promise((resolve, reject) => {
      this._s3Client.listObjectsV2(params, (err: any, data: any) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(data);

        let childItems = [];
        if (
          data.NextContinuationToken != undefined &&
          data.NextContinuationToken != null
        ) {
          hasMore = true;
          nextToken = data.NextContinuationToken;
        } else {
          hasMore = false;
          nextToken = "";
        }
        for (let i = 0; i < data.Contents.length; i++) {
          let filekey = data.Contents[i].Key;
          console.log(filekey);
          if (s3prefix != undefined) {
            filekey = filekey.replace(s3prefix + "/", "");
            console.log(filekey);
          }
          if (filekey.includes("/")) {
            console.log(filekey.split("/")[0]);
            let keyItem = filekey.split("/")[0];
            if (keyItem != undefined && keyItem != "") {
              childItems.push({ Name: keyItem, isLeaf: false });
            }
          } else {
            if (filekey != undefined && filekey != null && filekey != "") {
              childItems.push({ Name: filekey, isLeaf: true });
            }
          }
        }
        const uniqueArray = childItems.filter(
          (obj, index, self) =>
            self.findIndex((o) => o.Name === obj.Name) === index
        );
        console.log(uniqueArray);
        resolve({ items: uniqueArray, hasMore: hasMore, nextToken: nextToken });
      });
    });
  }

  putObject(s3bucket: string, s3url: string, contents: string) {
    return new Promise((resolve, reject) => {
      this._s3Client.putObject(
        {
          Bucket: s3bucket,
          Key: s3url,
          Body: contents,
        },
        (err: any, data: any) => {
          if (err) {
            console.error("Error writing JSON content to S3 object:", err);
            reject("Error writing JSON content to S3 object:" + err);
          }
          resolve(true);
          console.log("JSON content successfully written to S3 object!");
        }
      );
    });
  }

  getObject(s3bucket: string, s3url: string) {
    return new Promise((resolve, reject) => {
      this._s3Client.getObject(
        {
          Bucket: s3bucket,
          Key: s3url,
        },
        (err: any, data: any) => {
          if (err) {
            console.error("Error getting JSON object from S3:", err);
            reject(err);
          }
          // Parse the JSON object
          // const jsonObject = JSON.parse(data.Body.toString());
          let content = data.Body.toString();
          resolve(content);
        }
      );
    });
  }
}

export default S3Client;
