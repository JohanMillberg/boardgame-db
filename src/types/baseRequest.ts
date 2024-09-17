import { TokenContents } from "./token";

export { }

declare global {
    namespace Express {
        export interface Request {
            user: TokenContents;
        }
    }
}
