import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
  PreferencesEntity,
  RotationEntity,
} from "../entities";
import { CurrentOptions } from "./OptionsPage/CurrentOptions";
import { PastChoices } from "./OptionsPage/PastChoices";
import { Divider } from "@aws-amplify/ui-react";

export const OptionsPage = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  return (
    <>
      <CurrentOptions {...props} />
      <Divider />
      <PastChoices {...props} />
    </>
  );
};
