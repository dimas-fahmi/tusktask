import { cn } from "cn";
import Link from "next/link";
import { useLocale } from "next-intl";
import React from "react";

export type StyledLinkProps = {
  appendLocale?: boolean;
} & React.ComponentPropsWithRef<"a">;

const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ className, href, appendLocale = true, ...props }, ref) => {
    const locale = useLocale();
    const _raw = href ?? "#";
    const _href = appendLocale ? `/${locale}${_raw}` : _raw;

    return (
      <Link
        ref={ref}
        href={_href}
        {...props}
        className={cn(
          "font-semibold text-link not-visited:hover:underline visited:underline transition-all duration-200",
          className,
        )}
      />
    );
  },
);

StyledLink.displayName = "StyledLink";

export default StyledLink;
