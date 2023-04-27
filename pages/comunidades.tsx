import React from "react";
import { GetServerSideProps, NextPage } from "next";
import api, { serverSideAPi } from "@/config/api";
import { Community } from "@/models/Community";
import { SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import CommunityCard from "@/components/community/CommunityCard";

interface Props {
  communities: Community[];
}

const Comunidades: NextPage<Props> = ({ communities }) => {
  const { data, isLoading } = useQuery<Community[]>(
    ["communities"],
    async () => (await api.get<Community[]>("/communities")).data,
    {
      initialData: communities,
    }
  );

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 4 }}
      gap={5}
      justifyItems={{ sm: "center", lg: "stretch" }}
    >
      {data.map((community) => (
        <Skeleton isLoaded={!isLoading} key={community.id}>
          <CommunityCard community={community} />
        </Skeleton>
      ))}
    </SimpleGrid>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: communities } = await serverSideAPi(ctx).get<Community[]>(
    "/communities"
  );

  return {
    props: {
      communities,
    } as Props,
  };
};

export default Comunidades;
