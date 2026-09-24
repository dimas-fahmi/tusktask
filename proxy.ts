import { chain } from "./src/middleware/chain";
import { withAuth } from "./src/middleware/functions/withAuth";
import { withlocale } from "./src/middleware/functions/withLocale";

export default chain([withlocale, withAuth]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|res).*)"],
};
