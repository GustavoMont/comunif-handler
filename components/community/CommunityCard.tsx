import { Community } from "@/models/Community";
import {
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  Image,
  Stack,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { FiX, FiCheck } from "react-icons/fi";
interface Props {
  community: Community;
}

interface TagProps {
  isActive: boolean;
}
const ActiveTag: React.FC<TagProps> = ({ isActive }) => (
  <Tag size="lg" colorScheme={isActive ? "green" : "red"} borderRadius="full">
    {isActive ? <FiCheck width={8} /> : <FiX width={8} />}
    <TagLabel ml={2}>{isActive ? "Ativa" : "Inativa"}</TagLabel>
  </Tag>
);

const CommunityCard: React.FC<PropsWithChildren<Props>> = ({
  children,
  community,
}) => {
  const { banner, name, isActive } = community;
  return (
    <Card maxW="md">
      <CardBody>
        <Image
          src={banner || "https://placehold.co/600x400"}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <HStack justifyContent={"space-between"}>
            <Heading size="md">{name}</Heading>
            <ActiveTag isActive={isActive} />
          </HStack>
          {children}
        </Stack>
      </CardBody>
      <Divider />
    </Card>
  );
};

export default CommunityCard;
