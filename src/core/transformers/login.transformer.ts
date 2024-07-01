import { BaseTransformer } from "./base.transformer";


export class LoginTransformer extends BaseTransformer {

    /**
     * Response form for login.
     * 
     * @param token 
     * @returns 
     */
    static singleTransform (token: string) {
        return { access_token: token }
    }
}