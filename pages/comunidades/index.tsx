import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Community } from "@/models/Community";
import {
  HStack,
  Heading,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import {
  DehydratedState,
  QueryClient,
  dehydrate,
  useQuery,
} from "@tanstack/react-query";
import CommunityCard from "@/components/community/CommunityCard";
import { ListResponse } from "@/models/Api";

import { ErrorBlock } from "@/components/common/Layout/ErrorBlock";
import { Pagination } from "@/components/common/Layout/Pagination";
import {
  CommunityQueryParams,
  listCommunities,
} from "@/services/community-requests";
import { AddCommunity } from "@/components/community/AddCommunty";
import { ManagementDrawer } from "@/components/common/Management/ManagementDrawer";

interface Props {
  communitiesList?: ListResponse<Community>;
  dehydratedState: DehydratedState;
}

const initialQuery: CommunityQueryParams = {
  page: 1,
};

const Comunidades: NextPage<Props> = () => {
  const [filters, setFilters] = useState<CommunityQueryParams>(initialQuery);

  const {
    data: communitiesList,
    isError,
    isLoading,
  } = useQuery(["communities", filters], () => listCommunities(filters), {
    keepPreviousData: true,
    staleTime: 5000,
  });

  if (isError) {
    return (
      <ErrorBlock
        message="Ocorreu um erro ao listar as comunidades. Tente mais tarde!!!"
        title="Erro ao listar as comunidades"
      />
    );
  }

  const communities = communitiesList?.results;
  const meta = communitiesList?.meta;
  const onNext = () =>
    setFilters(({ page, ...prev }) => ({
      ...prev,
      page: page ? Math.min(page + 1, meta?.pages || 0) : 1,
    }));
  const onPrevious = () =>
    setFilters(({ page, ...prev }) => ({
      ...prev,
      page: page ? Math.max(page - 1, 1) : 1,
    }));

  return (
    <Stack spacing={5}>
      <Heading as={"h2"} color={"primary.500"}>
        Comunidades
        <ManagementDrawer
          options={[{ content: <AddCommunity /> }]}
          title="Comunidades"
        />
      </Heading>
      <HStack spacing={4}>
        <RadioGroup
          defaultValue="all"
          onChange={(value) => {
            setFilters((prev) => ({
              ...prev,
              isActive: value === "all" ? undefined : value === "true",
            }));
          }}
          colorScheme="primary"
        >
          <HStack>
            <Radio value="all">Todas</Radio>
            <Radio value="true">Ativas</Radio>
            <Radio value="false">Inativas</Radio>
          </HStack>
        </RadioGroup>
      </HStack>
      {meta?.page && (
        <Pagination
          onNext={onNext}
          onPrevious={onPrevious}
          alignSelf={"center"}
          currentPage={filters?.page || 1}
          pages={meta?.pages || 0}
        />
      )}
      <Heading as={"h3"} size={"sm"}></Heading>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 4 }}
        gap={5}
        justifyItems={{ sm: "center", lg: "stretch" }}
      >
        {communities?.map((community) => (
          <Skeleton isLoaded={!isLoading} key={community.id}>
            <CommunityCard community={community} />
          </Skeleton>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

// interface Option {
//   title?: string;
//   content: React.ReactNode;
//   icon?: (props: { size: string }) => JSX.Element;
// }

// const Options: React.FC = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const btnRef = useRef<HTMLButtonElement>(null);
//   interface Option {
//     title?: string;
//     content: React.ReactNode;
//     icon?: (props: { size: string }) => JSX.Element;
//   }
//   const options: Option[] = [
//     {
//       content: <AddCommunity />,
//     },
//   ];

//   return (
//     <>
//       <IconButton
//         w={"fit-content"}
//         rounded={"full"}
//         aria-label="Opções"
//         variant={"ghost"}
//         ref={btnRef}
//         colorScheme="primary"
//         onClick={onOpen}
//         icon={<HiOutlineAdjustments size={"24"} />}
//       />

//       <Drawer
//         isOpen={isOpen}
//         placement="right"
//         onClose={onClose}
//         finalFocusRef={btnRef}
//       >
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton color={"lightBlack"} />
//           <DrawerHeader color={"lightBlack"}>Comunidades</DrawerHeader>

//           <DrawerBody>
//             <Stack spacing={6}>
//               {options.map(({ title, content, icon: Icon }, index) => (
//                 <Box key={index}>
//                   <Box>
//                     {title && (
//                       <Flex
//                         color={"secondary.400"}
//                         gap={2}
//                         alignItems={"center"}
//                         marginBottom={"4"}
//                       >
//                         {Icon && <Icon size="16" />}
//                         <Heading as={"h4"} size={"md"}>
//                           {title}
//                         </Heading>
//                       </Flex>
//                     )}
//                     {content}
//                   </Box>
//                   {index !== options.length - 1 && (
//                     <Divider
//                       orientation="horizontal"
//                       variant={"solid"}
//                       size={"50px"}
//                     />
//                   )}
//                 </Box>
//               ))}
//             </Stack>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// };

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["communities"], () =>
    listCommunities(initialQuery, ctx)
  );
  try {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      } as Props,
    };
  } catch (error) {
    return {
      props: {
        communitiesList: {},
      } as Props,
    };
  }
};

export default Comunidades;
