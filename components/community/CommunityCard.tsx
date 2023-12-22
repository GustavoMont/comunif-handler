import { Community, UpdateCommunity } from "@/models/Community";
import { updateCommunity } from "@/services/community-requests";
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
import Link from "next/link";
import React, { PropsWithChildren, useEffect, useState } from "react";
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

  const queryClient = useQueryClient();
  const onSubmit = async (data: UpdateCommunity) => {
    await updateCommunity(id, data);
    queryClient.invalidateQueries(["communities"]);
  };
  const { isLoading, mutate } = useMutation(handleSubmit(onSubmit), {
    onSuccess() {
      queryClient.invalidateQueries();
      generateNewTimeStamp();
      disableEditMode();
    },
  });

  const changeEditMode = (value: boolean | "toggle") =>
    setIsEditing((prev) => (value === "toggle" ? !prev : value));
  const enableEditMode = () => changeEditMode(true);
  const disableEditMode = () => changeEditMode(false);

  function EditableControls() {
    return (
      <HStack justifyContent={"end"} spacing={5}>
        {isEditing ? (
          <Button onClick={disableEditMode} colorScheme="blackAlpha">
            Cancelar
          </Button>
        ) : (
          <></>
        )}
        <Button
          onClick={isEditing ? undefined : enableEditMode}
          type={isEditing ? "submit" : "button"}
          colorScheme="blue"
        >
          {isEditing ? "Confirmar" : "Editar"}
        </Button>
        {!isEditing ? (
          <Link href={`comunidades/${community.id}/`}>
            <Button colorScheme="primary">Acessar</Button>
          </Link>
        ) : (
          <></>
        )}
      </HStack>
    );
  }

  useEffect(() => {
    if (community) {
      queryClient.setQueryData(
        ["community", community.id.toString()],
        community
      );
    }
  }, [community, queryClient]);

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
                src={banner ? `${banner}/?${imageTimeStamp}` : ""}
                alt={`Comunidade ${name}`}
                fallbackSrc="https://via.placeholder.com/150"
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
