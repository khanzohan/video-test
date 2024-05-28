import { Text, Box, Button, HStack, VStack, StackProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface NavigatorProps extends StackProps {
  children?: React.ReactNode;
  spacing?: number
  title?: string;
  link?: string;
  linkTitle?: string;
  linkIcon?: React.ReactElement;
}

const Navigator: React.FC<NavigatorProps> = ({
  title,
  children,
  spacing = 12,
  link = "/",
  linkTitle = "Go Back",
  linkIcon = <ArrowBackIcon />,
  ...props
}) => (
  <VStack spacing={spacing} {...props}>
    <HStack w="full" justify="space-between">
      <Text fontSize="xl">{title}</Text>
      <Button
        as={Link}
        leftIcon={linkIcon}
        to={link}
        _hover={{ textDecor: "none" }}
      >
        {linkTitle}
      </Button>
    </HStack>
    <Box w="full">{children}</Box>
  </VStack>
);

export default Navigator;
