import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { v4 } from "uuid";

export interface BreadCrumbLink {
  name: string;
  href: string;
  isCurrentPage?: boolean;
}

interface Props {
  links: BreadCrumbLink[];
}

export const BreadCrumb: React.FC<Props> = ({ links }) => {
  return (
    <Breadcrumb separator={">"} color="secondary.200">
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} href="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      {links.map((link) => (
        <BreadcrumbItem key={v4()}>
          <BreadcrumbLink
            isCurrentPage={link.isCurrentPage}
            color={link.isCurrentPage ? "secondary.500" : undefined}
            as={Link}
            href={link.href}
          >
            {link.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}

      {/* <BreadcrumbItem color={"secondary.500"} isCurrentPage>
        <Link passHref href="">
          <BreadcrumbLink as={"p"}>{community?.name}</BreadcrumbLink>
        </Link>
      </BreadcrumbItem> */}
    </Breadcrumb>
  );
};
