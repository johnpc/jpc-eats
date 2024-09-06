/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Choice = {
  __typename: "Choice";
  createdAt: string;
  id: string;
  optionPlaceIds: Array<string | null>;
  owner?: string | null;
  selectedPlaceId?: string | null;
  updatedAt: string;
};

export type GoogleApiCache = {
  __typename: "GoogleApiCache";
  createdAt: string;
  hash: string;
  id: string;
  owner?: string | null;
  source?: string | null;
  updatedAt: string;
  value: string;
};

export type Preferences = {
  __typename: "Preferences";
  compactMode?: boolean | null;
  createdAt: string;
  id: string;
  owner?: string | null;
  updatedAt: string;
};

export type Rotation = {
  __typename: "Rotation";
  createdAt: string;
  googlePlaceId: string;
  id: string;
  owner?: string | null;
  updatedAt: string;
};

export type ModelChoiceFilterInput = {
  and?: Array<ModelChoiceFilterInput | null> | null;
  createdAt?: ModelStringInput | null;
  id?: ModelIDInput | null;
  not?: ModelChoiceFilterInput | null;
  optionPlaceIds?: ModelStringInput | null;
  or?: Array<ModelChoiceFilterInput | null> | null;
  owner?: ModelStringInput | null;
  selectedPlaceId?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelStringInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}

export type ModelSizeInput = {
  between?: Array<number | null> | null;
  eq?: number | null;
  ge?: number | null;
  gt?: number | null;
  le?: number | null;
  lt?: number | null;
  ne?: number | null;
};

export type ModelIDInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  size?: ModelSizeInput | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type ModelChoiceConnection = {
  __typename: "ModelChoiceConnection";
  items: Array<Choice | null>;
  nextToken?: string | null;
};

export type ModelGoogleApiCacheFilterInput = {
  and?: Array<ModelGoogleApiCacheFilterInput | null> | null;
  createdAt?: ModelStringInput | null;
  hash?: ModelStringInput | null;
  id?: ModelIDInput | null;
  not?: ModelGoogleApiCacheFilterInput | null;
  or?: Array<ModelGoogleApiCacheFilterInput | null> | null;
  owner?: ModelStringInput | null;
  source?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  value?: ModelStringInput | null;
};

export type ModelGoogleApiCacheConnection = {
  __typename: "ModelGoogleApiCacheConnection";
  items: Array<GoogleApiCache | null>;
  nextToken?: string | null;
};

export type ModelPreferencesFilterInput = {
  and?: Array<ModelPreferencesFilterInput | null> | null;
  compactMode?: ModelBooleanInput | null;
  createdAt?: ModelStringInput | null;
  id?: ModelIDInput | null;
  not?: ModelPreferencesFilterInput | null;
  or?: Array<ModelPreferencesFilterInput | null> | null;
  owner?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  eq?: boolean | null;
  ne?: boolean | null;
};

export type ModelPreferencesConnection = {
  __typename: "ModelPreferencesConnection";
  items: Array<Preferences | null>;
  nextToken?: string | null;
};

export type ModelRotationFilterInput = {
  and?: Array<ModelRotationFilterInput | null> | null;
  createdAt?: ModelStringInput | null;
  googlePlaceId?: ModelStringInput | null;
  id?: ModelIDInput | null;
  not?: ModelRotationFilterInput | null;
  or?: Array<ModelRotationFilterInput | null> | null;
  owner?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelRotationConnection = {
  __typename: "ModelRotationConnection";
  items: Array<Rotation | null>;
  nextToken?: string | null;
};

export type ModelChoiceConditionInput = {
  and?: Array<ModelChoiceConditionInput | null> | null;
  createdAt?: ModelStringInput | null;
  not?: ModelChoiceConditionInput | null;
  optionPlaceIds?: ModelStringInput | null;
  or?: Array<ModelChoiceConditionInput | null> | null;
  owner?: ModelStringInput | null;
  selectedPlaceId?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type CreateChoiceInput = {
  id?: string | null;
  optionPlaceIds: Array<string | null>;
  selectedPlaceId?: string | null;
};

export type ModelGoogleApiCacheConditionInput = {
  and?: Array<ModelGoogleApiCacheConditionInput | null> | null;
  createdAt?: ModelStringInput | null;
  hash?: ModelStringInput | null;
  not?: ModelGoogleApiCacheConditionInput | null;
  or?: Array<ModelGoogleApiCacheConditionInput | null> | null;
  owner?: ModelStringInput | null;
  source?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  value?: ModelStringInput | null;
};

export type CreateGoogleApiCacheInput = {
  hash: string;
  id?: string | null;
  source?: string | null;
  value: string;
};

export type ModelPreferencesConditionInput = {
  and?: Array<ModelPreferencesConditionInput | null> | null;
  compactMode?: ModelBooleanInput | null;
  createdAt?: ModelStringInput | null;
  not?: ModelPreferencesConditionInput | null;
  or?: Array<ModelPreferencesConditionInput | null> | null;
  owner?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type CreatePreferencesInput = {
  compactMode?: boolean | null;
  id?: string | null;
};

export type ModelRotationConditionInput = {
  and?: Array<ModelRotationConditionInput | null> | null;
  createdAt?: ModelStringInput | null;
  googlePlaceId?: ModelStringInput | null;
  not?: ModelRotationConditionInput | null;
  or?: Array<ModelRotationConditionInput | null> | null;
  owner?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type CreateRotationInput = {
  googlePlaceId: string;
  id?: string | null;
};

export type DeleteChoiceInput = {
  id: string;
};

export type DeleteGoogleApiCacheInput = {
  id: string;
};

export type DeletePreferencesInput = {
  id: string;
};

export type DeleteRotationInput = {
  id: string;
};

export type UpdateChoiceInput = {
  id: string;
  optionPlaceIds?: Array<string | null> | null;
  selectedPlaceId?: string | null;
};

export type UpdateGoogleApiCacheInput = {
  hash?: string | null;
  id: string;
  source?: string | null;
  value?: string | null;
};

export type UpdatePreferencesInput = {
  compactMode?: boolean | null;
  id: string;
};

export type UpdateRotationInput = {
  googlePlaceId?: string | null;
  id: string;
};

export type ModelSubscriptionChoiceFilterInput = {
  and?: Array<ModelSubscriptionChoiceFilterInput | null> | null;
  createdAt?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  optionPlaceIds?: ModelSubscriptionStringInput | null;
  or?: Array<ModelSubscriptionChoiceFilterInput | null> | null;
  owner?: ModelStringInput | null;
  selectedPlaceId?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  in?: Array<string | null> | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  in?: Array<string | null> | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionGoogleApiCacheFilterInput = {
  and?: Array<ModelSubscriptionGoogleApiCacheFilterInput | null> | null;
  createdAt?: ModelSubscriptionStringInput | null;
  hash?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  or?: Array<ModelSubscriptionGoogleApiCacheFilterInput | null> | null;
  owner?: ModelStringInput | null;
  source?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  value?: ModelSubscriptionStringInput | null;
};

export type ModelSubscriptionPreferencesFilterInput = {
  and?: Array<ModelSubscriptionPreferencesFilterInput | null> | null;
  compactMode?: ModelSubscriptionBooleanInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  or?: Array<ModelSubscriptionPreferencesFilterInput | null> | null;
  owner?: ModelStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null;
  ne?: boolean | null;
};

export type ModelSubscriptionRotationFilterInput = {
  and?: Array<ModelSubscriptionRotationFilterInput | null> | null;
  createdAt?: ModelSubscriptionStringInput | null;
  googlePlaceId?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  or?: Array<ModelSubscriptionRotationFilterInput | null> | null;
  owner?: ModelStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
};

export type GetChoiceQueryVariables = {
  id: string;
};

export type GetChoiceQuery = {
  getChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type GetGoogleApiCacheQueryVariables = {
  id: string;
};

export type GetGoogleApiCacheQuery = {
  getGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type GetPreferencesQueryVariables = {
  id: string;
};

export type GetPreferencesQuery = {
  getPreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type GetRotationQueryVariables = {
  id: string;
};

export type GetRotationQuery = {
  getRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type ListChoiceBySelectedPlaceIdQueryVariables = {
  filter?: ModelChoiceFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  selectedPlaceId: string;
  sortDirection?: ModelSortDirection | null;
};

export type ListChoiceBySelectedPlaceIdQuery = {
  listChoiceBySelectedPlaceId?: {
    __typename: "ModelChoiceConnection";
    items: Array<{
      __typename: "Choice";
      createdAt: string;
      id: string;
      optionPlaceIds: Array<string | null>;
      owner?: string | null;
      selectedPlaceId?: string | null;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListChoicesQueryVariables = {
  filter?: ModelChoiceFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListChoicesQuery = {
  listChoices?: {
    __typename: "ModelChoiceConnection";
    items: Array<{
      __typename: "Choice";
      createdAt: string;
      id: string;
      optionPlaceIds: Array<string | null>;
      owner?: string | null;
      selectedPlaceId?: string | null;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListGoogleApiCacheByHashQueryVariables = {
  filter?: ModelGoogleApiCacheFilterInput | null;
  hash: string;
  limit?: number | null;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type ListGoogleApiCacheByHashQuery = {
  listGoogleApiCacheByHash?: {
    __typename: "ModelGoogleApiCacheConnection";
    items: Array<{
      __typename: "GoogleApiCache";
      createdAt: string;
      hash: string;
      id: string;
      owner?: string | null;
      source?: string | null;
      updatedAt: string;
      value: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListGoogleApiCachesQueryVariables = {
  filter?: ModelGoogleApiCacheFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListGoogleApiCachesQuery = {
  listGoogleApiCaches?: {
    __typename: "ModelGoogleApiCacheConnection";
    items: Array<{
      __typename: "GoogleApiCache";
      createdAt: string;
      hash: string;
      id: string;
      owner?: string | null;
      source?: string | null;
      updatedAt: string;
      value: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListPreferencesQueryVariables = {
  filter?: ModelPreferencesFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListPreferencesQuery = {
  listPreferences?: {
    __typename: "ModelPreferencesConnection";
    items: Array<{
      __typename: "Preferences";
      compactMode?: boolean | null;
      createdAt: string;
      id: string;
      owner?: string | null;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListRotationsQueryVariables = {
  filter?: ModelRotationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListRotationsQuery = {
  listRotations?: {
    __typename: "ModelRotationConnection";
    items: Array<{
      __typename: "Rotation";
      createdAt: string;
      googlePlaceId: string;
      id: string;
      owner?: string | null;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type CreateChoiceMutationVariables = {
  condition?: ModelChoiceConditionInput | null;
  input: CreateChoiceInput;
};

export type CreateChoiceMutation = {
  createChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type CreateGoogleApiCacheMutationVariables = {
  condition?: ModelGoogleApiCacheConditionInput | null;
  input: CreateGoogleApiCacheInput;
};

export type CreateGoogleApiCacheMutation = {
  createGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type CreatePreferencesMutationVariables = {
  condition?: ModelPreferencesConditionInput | null;
  input: CreatePreferencesInput;
};

export type CreatePreferencesMutation = {
  createPreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type CreateRotationMutationVariables = {
  condition?: ModelRotationConditionInput | null;
  input: CreateRotationInput;
};

export type CreateRotationMutation = {
  createRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type DeleteChoiceMutationVariables = {
  condition?: ModelChoiceConditionInput | null;
  input: DeleteChoiceInput;
};

export type DeleteChoiceMutation = {
  deleteChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type DeleteGoogleApiCacheMutationVariables = {
  condition?: ModelGoogleApiCacheConditionInput | null;
  input: DeleteGoogleApiCacheInput;
};

export type DeleteGoogleApiCacheMutation = {
  deleteGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type DeletePreferencesMutationVariables = {
  condition?: ModelPreferencesConditionInput | null;
  input: DeletePreferencesInput;
};

export type DeletePreferencesMutation = {
  deletePreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type DeleteRotationMutationVariables = {
  condition?: ModelRotationConditionInput | null;
  input: DeleteRotationInput;
};

export type DeleteRotationMutation = {
  deleteRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type UpdateChoiceMutationVariables = {
  condition?: ModelChoiceConditionInput | null;
  input: UpdateChoiceInput;
};

export type UpdateChoiceMutation = {
  updateChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type UpdateGoogleApiCacheMutationVariables = {
  condition?: ModelGoogleApiCacheConditionInput | null;
  input: UpdateGoogleApiCacheInput;
};

export type UpdateGoogleApiCacheMutation = {
  updateGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type UpdatePreferencesMutationVariables = {
  condition?: ModelPreferencesConditionInput | null;
  input: UpdatePreferencesInput;
};

export type UpdatePreferencesMutation = {
  updatePreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type UpdateRotationMutationVariables = {
  condition?: ModelRotationConditionInput | null;
  input: UpdateRotationInput;
};

export type UpdateRotationMutation = {
  updateRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type OnCreateChoiceSubscriptionVariables = {
  filter?: ModelSubscriptionChoiceFilterInput | null;
  owner?: string | null;
};

export type OnCreateChoiceSubscription = {
  onCreateChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type OnCreateGoogleApiCacheSubscriptionVariables = {
  filter?: ModelSubscriptionGoogleApiCacheFilterInput | null;
  owner?: string | null;
};

export type OnCreateGoogleApiCacheSubscription = {
  onCreateGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type OnCreatePreferencesSubscriptionVariables = {
  filter?: ModelSubscriptionPreferencesFilterInput | null;
  owner?: string | null;
};

export type OnCreatePreferencesSubscription = {
  onCreatePreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type OnCreateRotationSubscriptionVariables = {
  filter?: ModelSubscriptionRotationFilterInput | null;
  owner?: string | null;
};

export type OnCreateRotationSubscription = {
  onCreateRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type OnDeleteChoiceSubscriptionVariables = {
  filter?: ModelSubscriptionChoiceFilterInput | null;
  owner?: string | null;
};

export type OnDeleteChoiceSubscription = {
  onDeleteChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type OnDeleteGoogleApiCacheSubscriptionVariables = {
  filter?: ModelSubscriptionGoogleApiCacheFilterInput | null;
  owner?: string | null;
};

export type OnDeleteGoogleApiCacheSubscription = {
  onDeleteGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type OnDeletePreferencesSubscriptionVariables = {
  filter?: ModelSubscriptionPreferencesFilterInput | null;
  owner?: string | null;
};

export type OnDeletePreferencesSubscription = {
  onDeletePreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type OnDeleteRotationSubscriptionVariables = {
  filter?: ModelSubscriptionRotationFilterInput | null;
  owner?: string | null;
};

export type OnDeleteRotationSubscription = {
  onDeleteRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type OnUpdateChoiceSubscriptionVariables = {
  filter?: ModelSubscriptionChoiceFilterInput | null;
  owner?: string | null;
};

export type OnUpdateChoiceSubscription = {
  onUpdateChoice?: {
    __typename: "Choice";
    createdAt: string;
    id: string;
    optionPlaceIds: Array<string | null>;
    owner?: string | null;
    selectedPlaceId?: string | null;
    updatedAt: string;
  } | null;
};

export type OnUpdateGoogleApiCacheSubscriptionVariables = {
  filter?: ModelSubscriptionGoogleApiCacheFilterInput | null;
  owner?: string | null;
};

export type OnUpdateGoogleApiCacheSubscription = {
  onUpdateGoogleApiCache?: {
    __typename: "GoogleApiCache";
    createdAt: string;
    hash: string;
    id: string;
    owner?: string | null;
    source?: string | null;
    updatedAt: string;
    value: string;
  } | null;
};

export type OnUpdatePreferencesSubscriptionVariables = {
  filter?: ModelSubscriptionPreferencesFilterInput | null;
  owner?: string | null;
};

export type OnUpdatePreferencesSubscription = {
  onUpdatePreferences?: {
    __typename: "Preferences";
    compactMode?: boolean | null;
    createdAt: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};

export type OnUpdateRotationSubscriptionVariables = {
  filter?: ModelSubscriptionRotationFilterInput | null;
  owner?: string | null;
};

export type OnUpdateRotationSubscription = {
  onUpdateRotation?: {
    __typename: "Rotation";
    createdAt: string;
    googlePlaceId: string;
    id: string;
    owner?: string | null;
    updatedAt: string;
  } | null;
};
