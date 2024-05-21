import {
  Card,
  Image,
  View,
  Flex,
  Text,
  Button,
  useTheme,
} from "@aws-amplify/ui-react";

export const Footer = () => {
  const { tokens } = useTheme();
  return (
    <View
      backgroundColor={tokens.colors.background.secondary}
      padding={tokens.space.medium}
    >
      <Card>
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          alignContent="flex-start"
        >
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            alignContent="flex-start"
            gap={tokens.space.xs}
          >
            <Flex
              as="span"
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              alignContent="flex-start"
              gap={tokens.space.xs}
            >
              <Button as="a" href="https://github.com/johnpc/jpc-eats">
                <Image alt="github" src="/github.png" />
              </Button>
              <Text as="span">jpc.eats is open source.</Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};
