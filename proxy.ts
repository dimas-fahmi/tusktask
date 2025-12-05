import { chain } from "./src/lib/middlewares/chain";
import { withSessionMiddleware } from "./src/lib/middlewares/withSessionMiddleware";

export default chain([withSessionMiddleware]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
