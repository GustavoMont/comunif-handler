import {
  HStack,
  IconButton,
  IconButtonProps,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Props extends StackProps {
  currentPage: number;
  pages: number;
  onNext(): void;
  onPrevious(): void;
}

export const Pagination: React.FC<Props> = ({
  currentPage,
  pages,
  onNext,
  onPrevious,
  ...props
}) => {
  const iconSize = 20;
  const defaultButtonStyle = {
    variant: "ghost",
    colorScheme: "secondary",
  } as IconButtonProps;

  return (
    <HStack {...props} spacing={5}>
      <IconButton
        {...defaultButtonStyle}
        onClick={onPrevious}
        isDisabled={currentPage === 1}
        aria-label="Voltar a página"
        icon={<HiChevronLeft size={iconSize} />}
      />
      <Text as={"span"} color="secondary.300">
        Pagina <strong>{currentPage}</strong> de <strong>{pages}</strong>
      </Text>
      <IconButton
        {...defaultButtonStyle}
        isDisabled={currentPage === pages}
        onClick={onNext}
        aria-label="Próxima página"
        icon={<HiChevronRight size={iconSize} />}
      />
    </HStack>
  );
};
