import { EditableText } from "@/components/Form/EditableText";
import { TextInput } from "@/components/Form/TextInput";
import {
  BreadCrumb,
  BreadCrumbLink,
} from "@/components/common/Layout/BreadCrumb";
import { CommunitiesCarroulsel } from "@/components/community/CommunitiesCarroulsel";
import { useAuth } from "@/context/AuthContext";
import { listUserCommunities } from "@/services/community-requests";
import {
  UpdateUser,
  getUser,
  updateUser,
  updateUserAvatar,
} from "@/services/user-requests";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Input,
  ScaleFade,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCamera, HiPencil, HiX } from "react-icons/hi";
import { AxiosError } from "axios";
import { RoleEnum, User } from "@/models/User";
import { ActivateButtonControl } from "@/components/user/ActivateButtonControl";
import { RoleLabel } from "@/components/user/RoleLabel";

export default function Profile() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isEditing, onOpen, onClose } = useDisclosure();

  const userId = router.query.id ?? "0";
  const { user: currentUser, updateUser: updateAuthUser } = useAuth();
  const { data: user } = useQuery(
    ["user", userId],
    () => getUser(Number(userId)),
    {
      enabled: !!userId,
    }
  );
  const [hasChanges, setHasChanges] = useState(false);
  const { data: communities = [] } = useQuery(
    ["user-communities", userId],
    () => listUserCommunities(+userId)
  );
  type UpdateWholeUser = UpdateUser & {
    avatar?: FileList | string;
  };
  const { register, reset, handleSubmit, watch } = useForm<UpdateWholeUser>();
  const queryClient = useQueryClient();
  const isUserProfile = user?.id === currentUser?.id;
  const currentUserIsAdmin = currentUser?.role === RoleEnum.admin;
  const filter = user?.isActive ? undefined : "grayscale(0.8)";
  const breadCrumbItems: BreadCrumbLink[] = [
    {
      href: "/usuarios",
      name: "Usuários",
    },
    {
      href: `/usuarios/${user?.id}`,
      name: user?.name ?? "Usuário",
      isCurrentPage: true,
    },
  ];

  const updateCurrentUser = async ({ avatar, ...data }: UpdateWholeUser) => {
    if (!user) {
      throw new Error("User not provided");
    }
    if (typeof avatar === "object") {
      const response = await Promise.all([
        updateUser(user?.id, data),
        updateUserAvatar(user.id, { avatar }),
      ]);
      return response[1];
    }
    return await updateUser(user?.id, data);
  };

  const resetFormData = useCallback(
    (user: User) => {
      reset({
        bio: user?.bio,
        lastName: user?.lastName,
        name: user?.name,
        username: user?.username,
        avatar: user?.avatar ?? "",
      });
    },
    [reset]
  );

  const { mutate: update, isLoading: isUpdating } = useMutation(
    updateCurrentUser,
    {
      onSuccess(updatedUser) {
        updateAuthUser(updatedUser);
        resetFormData(updatedUser);
        return queryClient.invalidateQueries(["user", userId]);
      },
      onError(error: AxiosError<{ message: string }>) {
        toast({
          title: "Ocorreu um erro",
          description:
            error.response?.data.message ?? "Tente novamente mais tarde",
          colorScheme: "red",
        });
      },
      onSettled() {
        setHasChanges(false);
      },
    }
  );
  const createAvatarUrl = (avatar: File | null) => {
    if (avatar) {
      return URL.createObjectURL(avatar);
    }
    return "";
  };
  const handleAvatarPicture = () => {
    if (isEditing) {
      const avatar = watch("avatar");
      return typeof avatar === "string"
        ? `${avatar}?${Date.now()}`
        : createAvatarUrl(avatar?.item(0) ?? null);
    }
    return `${user?.avatar}?${Date.now()}` ?? null;
  };
  const onSubmit = (data: UpdateUser) => {
    update(data);
  };
  const onCancel = () => {
    if (hasChanges && user) {
      resetFormData(user);
    }
    onClose();
  };

  useEffect(() => {
    if (user) {
      resetFormData(user);

      const subscribe = watch(() => setHasChanges(true));
      return () => {
        subscribe.unsubscribe();
      };
    }
  }, [resetFormData, user, watch]);

  return (
    <Stack as={"main"}>
      <BreadCrumb links={breadCrumbItems} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          rowGap={[5, null, 10]}
          justifyItems={["center", null, "start"]}
          templateColumns={["repeat(1, 1fr)", null, "180px repeat(1, 1fr)"]}
        >
          <GridItem filter={filter} alignSelf={["center", null, "start"]}>
            <Avatar size="2xl" src={handleAvatarPicture() ?? ""}>
              <ScaleFade initialScale={0.1} in={isEditing}>
                <AvatarBadge boxSize={"3rem"}>
                  <IconButton
                    as={"label"}
                    htmlFor="avatar"
                    cursor={"pointer"}
                    aria-label="editar avatar"
                    colorScheme="secondary"
                    rounded={"full"}
                    icon={<HiCamera />}
                  />
                </AvatarBadge>
              </ScaleFade>
            </Avatar>
            {isEditing ? (
              <Input srOnly id="avatar" type="file" {...register("avatar")} />
            ) : null}
          </GridItem>
          <GridItem colStart={[1, null, 2]} w={[null, null, "auto"]}>
            <Stack position={"relative"}>
              <Box filter={filter}>
                <EditableText
                  input={
                    <HStack spacing={4}>
                      <TextInput
                        colorScheme="primary"
                        variant={"flushed"}
                        register={register("name")}
                      />
                      <TextInput
                        colorScheme="primary"
                        variant={"flushed"}
                        register={register("lastName")}
                      />
                    </HStack>
                  }
                  isEditing={isEditing}
                  text={
                    <Heading
                      textAlign={["center", null, "start"]}
                      color={"primary.500"}
                      as={"h2"}
                    >
                      {`${user?.name} ${user?.lastName}`}
                    </Heading>
                  }
                />
                {!isEditing ? (
                  <RoleLabel
                    position={"absolute"}
                    top={"8"}
                    right={"-2"}
                    alignSelf={"self-start"}
                    role={user?.role}
                  />
                ) : null}
                <EditableText
                  input={
                    <TextInput
                      colorScheme="secondary"
                      variant={"flushed"}
                      register={register("username")}
                    />
                  }
                  text={
                    <Text
                      textAlign={["center", null, "start"]}
                      color={"secondary.500"}
                      as={"p"}
                      fontSize={"large"}
                    >
                      @{user?.username}
                    </Text>
                  }
                  isEditing={isEditing}
                />
              </Box>
              <Flex
                wrap={["wrap", null, "nowrap"]}
                w={["full", null, "min"]}
                justifyContent={"center"}
                gap={5}
              >
                {isUserProfile ? (
                  <>
                    {isEditing ? (
                      <Button
                        leftIcon={<HiX />}
                        colorScheme="secondary"
                        onClick={onCancel}
                      >
                        Cancelar
                      </Button>
                    ) : null}

                    {isEditing ? (
                      <Button
                        leftIcon={<HiPencil />}
                        colorScheme="primary"
                        type="submit"
                        isDisabled={!hasChanges}
                        isLoading={isUpdating}
                      >
                        Atualizar Perfil
                      </Button>
                    ) : (
                      <Button
                        leftIcon={<HiPencil />}
                        colorScheme="primary"
                        onClick={onOpen}
                        isDisabled={isEditing && !hasChanges}
                        isLoading={isUpdating}
                      >
                        Editar Perfil
                      </Button>
                    )}
                  </>
                ) : null}
                {currentUserIsAdmin ? (
                  <ActivateButtonControl user={user} />
                ) : null}
              </Flex>
            </Stack>
          </GridItem>
          <GridItem w={"full"} colStart={1} colEnd={3}>
            <Divider borderColor={"primary.500"} />
          </GridItem>
          <GridItem
            filter={filter}
            as={Stack}
            spacing={[2, null, 5]}
            w={"full"}
            maxW={"xl"}
            colStart={1}
            colEnd={3}
            justifyContent={"start"}
          >
            <Stack justifyContent={"start"}>
              <Heading color={"primary.400"} as={"h4"}>
                Bio
              </Heading>
              <EditableText
                input={
                  <Textarea
                    borderColor={"primary.400"}
                    focusBorderColor="primary.500"
                    {...register("bio")}
                  />
                }
                isEditing={isEditing}
                text={
                  <Text color={"lightBlack"}>
                    {user?.bio ?? "usuário sem bio"}
                  </Text>
                }
              />
            </Stack>
            <Stack maxW={"2xl"} w={"full"}>
              <Heading color={"primary.400"}>Comunidades</Heading>
              <CommunitiesCarroulsel communities={communities} />
            </Stack>
          </GridItem>
        </Grid>
      </form>
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const userId = ctx.params?.id ?? "0";
    const queryClient = new QueryClient();
    await Promise.all([
      queryClient.prefetchQuery(["user", userId], () =>
        getUser(Number(userId), ctx)
      ),
      queryClient.prefetchQuery(["user-communities", userId], () =>
        listUserCommunities(+userId)
      ),
    ]);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
