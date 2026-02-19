import { LocalizedLink as SharedLocalizedLink } from "@sudobility/components";
import { isLanguageSupported } from "../../config/constants";
import type { ComponentProps } from "react";

type Props = Omit<
  ComponentProps<typeof SharedLocalizedLink>,
  "isLanguageSupported" | "defaultLanguage"
>;

export default function LocalizedLink(props: Props) {
  return (
    <SharedLocalizedLink
      {...props}
      isLanguageSupported={isLanguageSupported}
      defaultLanguage="en"
    />
  );
}
