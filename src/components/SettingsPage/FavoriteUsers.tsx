import { useState } from "react";
import { Flex, TextField, Button, Card, Text, useTheme } from "@aws-amplify/ui-react";
import { useFavoriteUsers, useAddFavoriteUser, useRemoveFavoriteUser } from "../../hooks/useFavoriteUsers";

export function FavoriteUsers() {
  const { tokens } = useTheme();
  const { data: favorites = [] } = useFavoriteUsers();
  const addFavorite = useAddFavoriteUser();
  const removeFavorite = useRemoveFavoriteUser();
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (!email) return;
    addFavorite.mutate(email);
    setEmail("");
  };

  return (
    <Card marginBottom={tokens.space.medium}>
      <Text fontWeight="bold" marginBottom={tokens.space.small}>
        Share Options With
      </Text>
      <Text fontSize="small" color={tokens.colors.font.secondary} marginBottom={tokens.space.small}>
        People you add here will see your options in their app and can make selections.
      </Text>
      <Flex direction="row" gap={tokens.space.xs}>
        <TextField
          label=""
          labelHidden
          placeholder="email@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          flex={1}
        />
        <Button onClick={handleAdd} isLoading={addFavorite.isPending}>
          Add
        </Button>
      </Flex>
      {favorites.map((fav) => (
        <Flex key={fav.id} justifyContent="space-between" alignItems="center" marginTop={tokens.space.xs}>
          <Text>{fav.email}</Text>
          <Button size="small" variation="link" onClick={() => removeFavorite.mutate(fav.id)}>
            Remove
          </Button>
        </Flex>
      ))}
    </Card>
  );
}
