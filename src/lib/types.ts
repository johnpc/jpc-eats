export type RotationEntity = {
  id: string;
  googlePlaceId: string;
};

export type ChoiceEntity = {
  id: string;
  optionPlaceIds: (string | null)[];
  selectedPlaceId?: string | null;
  updatedAt: string;
  createdAt: string;
};

export type PreferencesEntity = {
  id?: string;
  compactMode?: boolean | null;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
