/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createChoice = /* GraphQL */ `mutation CreateChoice(
  $condition: ModelChoiceConditionInput
  $input: CreateChoiceInput!
) {
  createChoice(condition: $condition, input: $input) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateChoiceMutationVariables,
  APITypes.CreateChoiceMutation
>;
export const createGoogleApiCache =
  /* GraphQL */ `mutation CreateGoogleApiCache(
  $condition: ModelGoogleApiCacheConditionInput
  $input: CreateGoogleApiCacheInput!
) {
  createGoogleApiCache(condition: $condition, input: $input) {
    createdAt
    hash
    id
    owner
    source
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateGoogleApiCacheMutationVariables,
    APITypes.CreateGoogleApiCacheMutation
  >;
export const createPreferences = /* GraphQL */ `mutation CreatePreferences(
  $condition: ModelPreferencesConditionInput
  $input: CreatePreferencesInput!
) {
  createPreferences(condition: $condition, input: $input) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePreferencesMutationVariables,
  APITypes.CreatePreferencesMutation
>;
export const createRotation = /* GraphQL */ `mutation CreateRotation(
  $condition: ModelRotationConditionInput
  $input: CreateRotationInput!
) {
  createRotation(condition: $condition, input: $input) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRotationMutationVariables,
  APITypes.CreateRotationMutation
>;
export const deleteChoice = /* GraphQL */ `mutation DeleteChoice(
  $condition: ModelChoiceConditionInput
  $input: DeleteChoiceInput!
) {
  deleteChoice(condition: $condition, input: $input) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteChoiceMutationVariables,
  APITypes.DeleteChoiceMutation
>;
export const deleteGoogleApiCache =
  /* GraphQL */ `mutation DeleteGoogleApiCache(
  $condition: ModelGoogleApiCacheConditionInput
  $input: DeleteGoogleApiCacheInput!
) {
  deleteGoogleApiCache(condition: $condition, input: $input) {
    createdAt
    hash
    id
    owner
    source
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteGoogleApiCacheMutationVariables,
    APITypes.DeleteGoogleApiCacheMutation
  >;
export const deletePreferences = /* GraphQL */ `mutation DeletePreferences(
  $condition: ModelPreferencesConditionInput
  $input: DeletePreferencesInput!
) {
  deletePreferences(condition: $condition, input: $input) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePreferencesMutationVariables,
  APITypes.DeletePreferencesMutation
>;
export const deleteRotation = /* GraphQL */ `mutation DeleteRotation(
  $condition: ModelRotationConditionInput
  $input: DeleteRotationInput!
) {
  deleteRotation(condition: $condition, input: $input) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRotationMutationVariables,
  APITypes.DeleteRotationMutation
>;
export const updateChoice = /* GraphQL */ `mutation UpdateChoice(
  $condition: ModelChoiceConditionInput
  $input: UpdateChoiceInput!
) {
  updateChoice(condition: $condition, input: $input) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateChoiceMutationVariables,
  APITypes.UpdateChoiceMutation
>;
export const updateGoogleApiCache =
  /* GraphQL */ `mutation UpdateGoogleApiCache(
  $condition: ModelGoogleApiCacheConditionInput
  $input: UpdateGoogleApiCacheInput!
) {
  updateGoogleApiCache(condition: $condition, input: $input) {
    createdAt
    hash
    id
    owner
    source
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateGoogleApiCacheMutationVariables,
    APITypes.UpdateGoogleApiCacheMutation
  >;
export const updatePreferences = /* GraphQL */ `mutation UpdatePreferences(
  $condition: ModelPreferencesConditionInput
  $input: UpdatePreferencesInput!
) {
  updatePreferences(condition: $condition, input: $input) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePreferencesMutationVariables,
  APITypes.UpdatePreferencesMutation
>;
export const updateRotation = /* GraphQL */ `mutation UpdateRotation(
  $condition: ModelRotationConditionInput
  $input: UpdateRotationInput!
) {
  updateRotation(condition: $condition, input: $input) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRotationMutationVariables,
  APITypes.UpdateRotationMutation
>;
