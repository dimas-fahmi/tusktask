import { chain } from "./src/middleware/chain";
import { withlocale } from "./src/middleware/functions/withLocale";

export default chain([withlocale]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|res).*)"],
};
