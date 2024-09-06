/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateChoice = /* GraphQL */ `subscription OnCreateChoice(
  $filter: ModelSubscriptionChoiceFilterInput
  $owner: String
) {
  onCreateChoice(filter: $filter, owner: $owner) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateChoiceSubscriptionVariables,
  APITypes.OnCreateChoiceSubscription
>;
export const onCreateGoogleApiCache =
  /* GraphQL */ `subscription OnCreateGoogleApiCache(
  $filter: ModelSubscriptionGoogleApiCacheFilterInput
  $owner: String
) {
  onCreateGoogleApiCache(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
    APITypes.OnCreateGoogleApiCacheSubscriptionVariables,
    APITypes.OnCreateGoogleApiCacheSubscription
  >;
export const onCreatePreferences =
  /* GraphQL */ `subscription OnCreatePreferences(
  $filter: ModelSubscriptionPreferencesFilterInput
  $owner: String
) {
  onCreatePreferences(filter: $filter, owner: $owner) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreatePreferencesSubscriptionVariables,
    APITypes.OnCreatePreferencesSubscription
  >;
export const onCreateRotation = /* GraphQL */ `subscription OnCreateRotation(
  $filter: ModelSubscriptionRotationFilterInput
  $owner: String
) {
  onCreateRotation(filter: $filter, owner: $owner) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRotationSubscriptionVariables,
  APITypes.OnCreateRotationSubscription
>;
export const onDeleteChoice = /* GraphQL */ `subscription OnDeleteChoice(
  $filter: ModelSubscriptionChoiceFilterInput
  $owner: String
) {
  onDeleteChoice(filter: $filter, owner: $owner) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteChoiceSubscriptionVariables,
  APITypes.OnDeleteChoiceSubscription
>;
export const onDeleteGoogleApiCache =
  /* GraphQL */ `subscription OnDeleteGoogleApiCache(
  $filter: ModelSubscriptionGoogleApiCacheFilterInput
  $owner: String
) {
  onDeleteGoogleApiCache(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
    APITypes.OnDeleteGoogleApiCacheSubscriptionVariables,
    APITypes.OnDeleteGoogleApiCacheSubscription
  >;
export const onDeletePreferences =
  /* GraphQL */ `subscription OnDeletePreferences(
  $filter: ModelSubscriptionPreferencesFilterInput
  $owner: String
) {
  onDeletePreferences(filter: $filter, owner: $owner) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeletePreferencesSubscriptionVariables,
    APITypes.OnDeletePreferencesSubscription
  >;
export const onDeleteRotation = /* GraphQL */ `subscription OnDeleteRotation(
  $filter: ModelSubscriptionRotationFilterInput
  $owner: String
) {
  onDeleteRotation(filter: $filter, owner: $owner) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRotationSubscriptionVariables,
  APITypes.OnDeleteRotationSubscription
>;
export const onUpdateChoice = /* GraphQL */ `subscription OnUpdateChoice(
  $filter: ModelSubscriptionChoiceFilterInput
  $owner: String
) {
  onUpdateChoice(filter: $filter, owner: $owner) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateChoiceSubscriptionVariables,
  APITypes.OnUpdateChoiceSubscription
>;
export const onUpdateGoogleApiCache =
  /* GraphQL */ `subscription OnUpdateGoogleApiCache(
  $filter: ModelSubscriptionGoogleApiCacheFilterInput
  $owner: String
) {
  onUpdateGoogleApiCache(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
    APITypes.OnUpdateGoogleApiCacheSubscriptionVariables,
    APITypes.OnUpdateGoogleApiCacheSubscription
  >;
export const onUpdatePreferences =
  /* GraphQL */ `subscription OnUpdatePreferences(
  $filter: ModelSubscriptionPreferencesFilterInput
  $owner: String
) {
  onUpdatePreferences(filter: $filter, owner: $owner) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdatePreferencesSubscriptionVariables,
    APITypes.OnUpdatePreferencesSubscription
  >;
export const onUpdateRotation = /* GraphQL */ `subscription OnUpdateRotation(
  $filter: ModelSubscriptionRotationFilterInput
  $owner: String
) {
  onUpdateRotation(filter: $filter, owner: $owner) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRotationSubscriptionVariables,
  APITypes.OnUpdateRotationSubscription
>;
