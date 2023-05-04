import api, { url } from "@/config/api";
import { Community, UpdateCommunity } from "@/models/Community";
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Skeleton,
  Stack,
  Switch,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiCheck } from "react-icons/fi";
interface Props {
  community: Community;
}

interface TagProps {
  isActive: boolean;
}
const ActiveTag: React.FC<TagProps> = ({ isActive }) => (
  <Tag size="lg" colorScheme={isActive ? "primary" : "red"} borderRadius="full">
    {isActive ? <FiCheck width={8} /> : <FiX width={8} />}
    <TagLabel ml={2}>{isActive ? "Ativa" : "Inativa"}</TagLabel>
  </Tag>
);

const CommunityCard: React.FC<PropsWithChildren<Props>> = ({ community }) => {
  const { banner, name, isActive, id } = community;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm<UpdateCommunity>({
    defaultValues: {
      name,
      isActive,
      banner,
    },
  });
  const queryClient = useQueryClient();
  const onSubmit = async (formData: UpdateCommunity) => {
    const multipartForm = new FormData();
    Object.keys(formData).forEach((key) => {
      const formKey: keyof UpdateCommunity = key as keyof UpdateCommunity;
      if (formKey !== "banner") {
        multipartForm.set(key, String(formData[formKey]));
      }
    });
    if (typeof formData.banner !== "string") {
      const banner = formData.banner?.item(0);
      banner && multipartForm.set("banner", banner);
    }
    await api.patch<UpdateCommunity>(`communities/${id}`, multipartForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    queryClient.invalidateQueries(["communities"]);
    disableEditMode();
  };
  const { isLoading, mutate } = useMutation(handleSubmit(onSubmit));
  const timeStamp = new Date().getTime();
  const bannerUrl = !!banner && `${url}/${banner}`;
  const changeEditMode = (value: boolean | "toggle") =>
    setIsEditing((prev) => (value === "toggle" ? !prev : value));
  const enableEditMode = () => changeEditMode(true);
  const disableEditMode = () => changeEditMode(false);

  function EditableControls() {
    return (
      <HStack justifyContent={"end"} spacing={5}>
        {isEditing && (
          <Button onClick={disableEditMode} colorScheme="blackAlpha">
            Cancelar
          </Button>
        )}
        <Button
          onClick={isEditing ? undefined : enableEditMode}
          type={isEditing ? "submit" : "button"}
          colorScheme="blue"
        >
          {isEditing ? "Confirmar" : "Editar"}
        </Button>
      </HStack>
    );
  }

  return (
    <Skeleton isLoaded={!isLoading}>
      <Card maxW="md">
        <CardBody>
          <Box position={"relative"}>
            <Stack
              justifyContent={"center"}
              w={"full"}
              h={"full"}
              display={"flex"}
              position={"absolute"}
            >
              <Box
                position={"absolute"}
                h={"full"}
                w={"full"}
                bg={"white"}
                top={0}
                left={0}
                display={isEditing ? "block" : "none"}
                opacity={0.8}
              />
              <Input
                size="md"
                type="file"
                alignItems={"center"}
                {...register("banner")}
                bg={"primary"}
                display={isEditing ? "block" : "none"}
              />
            </Stack>
            <Box w={"full"} h={{ sm: "280px", lg: "150px" }}>
              <Image
                src={`${bannerUrl}/?${timeStamp}` || ""}
                alt="Green double couch with wooden legs"
                fallbackSrc="https://via.placeholder.com/280x200"
                marginInline={"auto"}
                h={"inherit"}
                boxSize={"full"}
                objectFit={"cover"}
                borderRadius="lg"
              />
            </Box>
          </Box>

          <form onSubmit={mutate}>
            <Stack mt="6" spacing="6">
              <HStack alignItems={"self-end"} justifyContent={"space-between"}>
                {isEditing ? (
                  <Input
                    {...register("name")}
                    fontSize={"lg"}
                    variant="flushed"
                    w={"full"}
                  />
                ) : (
                  <Heading size="md">{name}</Heading>
                )}
                {isEditing ? (
                  <FormControl
                    display="flex"
                    alignItems="center"
                    gap={2}
                    w={"32"}
                  >
                    <FormLabel htmlFor="active" mb="0">
                      <Text>Ativar</Text>
                    </FormLabel>
                    <Switch
                      colorScheme="primary"
                      {...register("isActive")}
                      id="active"
                      size="sm"
                    />
                  </FormControl>
                ) : (
                  <ActiveTag isActive={isActive} />
                )}
              </HStack>
              <EditableControls />
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Skeleton>
  );

  // return (
  //   <Card maxW="md">
  //     <CardBody>
  //       <Image
  //         src={banner || "https://placehold.co/600x400"}
  //         alt="Green double couch with wooden legs"
  //         borderRadius="lg"
  //       />
  //       <Stack mt="6" spacing="6">
  //         <HStack justifyContent={"space-between"}>
  //           <Heading size="md">{name}</Heading>
  //           <ActiveTag isActive={isActive} />
  //         </HStack>
  //         {children}
  //         <HStack justifyContent={"end"} spacing={5}>
  //           {isEditMode && (
  //             <Button
  //               onClick={() => changeEditMode(false)}
  //               colorScheme="blackAlpha"
  //             >
  //               Cancelar
  //             </Button>
  //           )}
  //           <Button onClick={() => changeEditMode("toggle")} colorScheme="blue">
  //             {isEditMode ? "Confirmar" : "Editar"}
  //           </Button>
  //         </HStack>
  //       </Stack>
  //     </CardBody>
  //     <Divider />
  //   </Card>
  // );
};

export default CommunityCard;
