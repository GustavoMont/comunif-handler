import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { HiOutlineAdjustments } from "react-icons/hi";

export interface ManageOption {
  title?: string;
  content: React.ReactNode;
  icon?: (props: { size: string }) => JSX.Element;
}

interface Props {
  options: ManageOption[];
  title: string;
}

export const ManagementDrawer: React.FC<Props> = ({ options, title }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        w={"fit-content"}
        rounded={"full"}
        aria-label="Opções"
        variant={"ghost"}
        ref={btnRef}
        colorScheme="primary"
        onClick={onOpen}
        icon={<HiOutlineAdjustments size={"24"} />}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />

        <DrawerContent>
          <DrawerCloseButton color={"lightBlack"} />
          <DrawerHeader color={"lightBlack"}>{title}</DrawerHeader>

          <DrawerBody>
            <Stack spacing={6}>
              {options.map(({ title, content, icon: Icon }, index) => (
                <Box key={index}>
                  <Box>
                    {title ? (
                      <Flex
                        color={"secondary.400"}
                        gap={2}
                        alignItems={"center"}
                        marginBottom={"4"}
                      >
                        {Icon && <Icon size="16" />}
                        <Heading as={"h4"} size={"md"}>
                          {title}
                        </Heading>
                      </Flex>
                    ) : null}
                    {content}
                  </Box>
                  {index !== options.length - 1 ? (
                    <Divider
                      orientation="horizontal"
                      variant={"solid"}
                      size={"50px"}
                    />
                  ) : null}
                </Box>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
