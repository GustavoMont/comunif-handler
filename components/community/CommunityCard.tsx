import { url } from "@/config/api";
import { Community, UpdateCommunity } from "@/models/Community";
import { updateCommunity } from "@/utils/api/community-requests";
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
  const [imageTimeStamp, setImageTimeStamp] = useState<number>(
    new Date().getTime()
  );
  const generateNewTimeStamp = () => setImageTimeStamp(new Date().getTime());
  const { banner, name, isActive, id } = community;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm<UpdateCommunity>({
    defaultValues: {
      name,
      isActive,
      banner,
    },
  });

  const handleFormData = (
    key: string,
    formData: UpdateCommunity,
    form: FormData
  ) => {
    const formKey: keyof UpdateCommunity = key as keyof UpdateCommunity;
    if (formKey !== "banner") {
      form.set(key, String(formData[formKey]));
    }
  };
  const queryClient = useQueryClient();
  const onSubmit = async (formData: UpdateCommunity) => {
    const multipartForm = new FormData();
    Object.keys(formData).forEach((key) =>
      handleFormData(key, formData, multipartForm)
    );
    if (typeof formData.banner !== "string") {
      const banner = formData.banner?.item(0);
      banner && multipartForm.set("banner", banner);
    }
    await updateCommunity(id, multipartForm);
    queryClient.invalidateQueries(["communities"]);
  };
  const { isLoading, mutate } = useMutation(handleSubmit(onSubmit), {
    onSuccess() {
      queryClient.invalidateQueries();
      generateNewTimeStamp();
      disableEditMode();
    },
  });

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
                src={`${bannerUrl}/?${imageTimeStamp}` || ""}
                alt="Green double couch with wooden legs"
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
};

export default CommunityCard;
