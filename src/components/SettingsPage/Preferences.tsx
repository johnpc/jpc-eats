import { Card } from "@aws-amplify/ui-react";
import { PreferencesEntity } from "../../entities";

export default function Preferences(_: { preferences: PreferencesEntity }) {
  // const [isUpdating, setIsUpdating] = useState<boolean>();

  // const onUpdateCompactMode = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setIsUpdating(true);
  //   const shouldUseCompactMode = event.target.checked;
  //   await updatePreferences({
  //     ...props.preferences,
  //     compactMode: shouldUseCompactMode,
  //   });
  //   setIsUpdating(false);
  // };
  return (
    <Card textAlign={"left"}>
      {/* <SwitchField
        isChecked={props.preferences?.compactMode ?? false}
        isDisabled={isUpdating}
        onChange={onUpdateCompactMode}
        label="Use Compact Mode"
        labelPosition="start"
      /> */}
    </Card>
  );
}
