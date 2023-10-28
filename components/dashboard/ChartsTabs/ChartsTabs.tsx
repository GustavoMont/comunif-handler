import {
  Heading,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import { UsersChartTab } from "./UsersChartTab";

export const ChartsTabs = () => {
  return (
    <Tabs position="relative" variant="unstyled">
      <TabList>
        <Tab>
          <Heading fontSize={"sm"} as={"h4"}>
            Usuários
          </Heading>
        </Tab>
        <Tab>
          <Heading fontSize={"sm"} as={"h4"}>
            Comunidades
          </Heading>
        </Tab>
        <Tab>
          <Heading fontSize={"sm"} as={"h4"}>
            Mensagens
          </Heading>
        </Tab>
      </TabList>
      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="secondary.200"
        borderRadius="1px"
      />
      <TabPanels>
        <TabPanel>
          <UsersChartTab />
        </TabPanel>
        <TabPanel>
          <Heading as={"h4"}>Comunidades</Heading>
        </TabPanel>
        <TabPanel>
          <Heading as={"h4"}>Mensagens</Heading>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
