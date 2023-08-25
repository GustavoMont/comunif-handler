import { ListItem, UnorderedList } from "@chakra-ui/react";
import Link from "next/link";
import React, { DetailedHTMLProps } from "react";

type UlProps = DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

type Link = {
  href?: string;
  onClick?(): void;
};

interface Props extends Omit<UlProps, "children"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any[];
  name: string;
  hrefs: Link[];
  keyName: string;
  linkColor?: string;
}

export const LinksList: React.FC<Props> = ({
  name,
  source,
  keyName,
  hrefs,
}) => {
  if (source[0]) {
    if (typeof source[0] !== "object") {
      throw new Error("Is not a valid type");
    } else if (!(name in source[0])) {
      throw new Error("Name prop not found");
    } else if (!(keyName in source[0])) {
      throw new Error("Key prop not found");
    }
  }
  return (
    <UnorderedList listStyleType={"none"}>
      {source.map((item, i) => (
        <ListItem
          textDecoration={"underline"}
          transition={"ease-in-out"}
          transitionDuration={"150"}
          _hover={{
            color: "secondary.500",
          }}
          color={"secondary.400"}
          key={item[keyName]}
        >
          <Link href={hrefs[i].href ?? "#"} onClick={hrefs[i].onClick}>
            {item[name] as string}
          </Link>
        </ListItem>
      ))}
    </UnorderedList>
  );
};
