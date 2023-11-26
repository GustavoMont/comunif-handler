import {
  Heading,
  ScaleFade,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UsersChartTab } from "./UsersChartTab";
import { CommunitiesChartTab } from "./CommunitiesChartTab";
import { v4 } from "uuid";
import { MessagesChartTab } from "./MessagesChartTab";

export const ChartsTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  type Tab = {
    title: string;
    panel: JSX.Element;
  };
  const tabs: Tab[] = [
    {
      panel: <UsersChartTab />,
      title: "Usuários",
    },
    {
      panel: <CommunitiesChartTab />,
      title: "Comunidades",
    },
    {
      panel: <MessagesChartTab />,
      title: "Mensagens",
    },
  ];
  return (
    <Tabs
      tabIndex={tabIndex}
      onChange={setTabIndex}
      position="relative"
      variant="unstyled"
    >
      <TabList>
        {tabs.map(({ title }) => (
          <Tab key={v4()}>
            <Heading fontSize={"sm"} as={"h4"}>
              {title}
            </Heading>
          </Tab>
        ))}
      </TabList>
      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="secondary.200"
        borderRadius="1px"
      />
      <TabPanels>
        {tabs.map(({ panel }, index) => (
          <TabPanel key={v4()}>
            <ScaleFade
              delay={{
                enter: 0.2,
                exit: 0.1,
              }}
              initialScale={0.8}
              in={index === tabIndex}
            >
              {panel}
            </ScaleFade>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
