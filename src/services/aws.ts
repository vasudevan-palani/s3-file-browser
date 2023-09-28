class AwsCredentials {
    accessKey : string;
    secretKey : string;

    constructor(accessKey: string, secretKey: string) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }

    setAccessKey(accessKey : string){
        this.accessKey = accessKey
    }

    setSecretKey(secretKey : string){
        this.secretKey = secretKey
    }

    getAccessKey(){
        return this.accessKey
    }

    getSecretKey(){
        return this.secretKey
    }
}

let Credentials = new AwsCredentials("","")
export default Credentials