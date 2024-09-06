/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getChoice = /* GraphQL */ `query GetChoice($id: ID!) {
  getChoice(id: $id) {
    createdAt
    id
    optionPlaceIds
    owner
    selectedPlaceId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetChoiceQueryVariables, APITypes.GetChoiceQuery>;
export const getGoogleApiCache =
  /* GraphQL */ `query GetGoogleApiCache($id: ID!) {
  getGoogleApiCache(id: $id) {
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
` as GeneratedQuery<
    APITypes.GetGoogleApiCacheQueryVariables,
    APITypes.GetGoogleApiCacheQuery
  >;
export const getPreferences = /* GraphQL */ `query GetPreferences($id: ID!) {
  getPreferences(id: $id) {
    compactMode
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPreferencesQueryVariables,
  APITypes.GetPreferencesQuery
>;
export const getRotation = /* GraphQL */ `query GetRotation($id: ID!) {
  getRotation(id: $id) {
    createdAt
    googlePlaceId
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRotationQueryVariables,
  APITypes.GetRotationQuery
>;
export const listChoiceBySelectedPlaceId =
  /* GraphQL */ `query ListChoiceBySelectedPlaceId(
  $filter: ModelChoiceFilterInput
  $limit: Int
  $nextToken: String
  $selectedPlaceId: String!
  $sortDirection: ModelSortDirection
) {
  listChoiceBySelectedPlaceId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    selectedPlaceId: $selectedPlaceId
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      optionPlaceIds
      owner
      selectedPlaceId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ListChoiceBySelectedPlaceIdQueryVariables,
    APITypes.ListChoiceBySelectedPlaceIdQuery
  >;
export const listChoices = /* GraphQL */ `query ListChoices(
  $filter: ModelChoiceFilterInput
  $limit: Int
  $nextToken: String
) {
  listChoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      optionPlaceIds
      owner
      selectedPlaceId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChoicesQueryVariables,
  APITypes.ListChoicesQuery
>;
export const listGoogleApiCacheByHash =
  /* GraphQL */ `query ListGoogleApiCacheByHash(
  $filter: ModelGoogleApiCacheFilterInput
  $hash: String!
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listGoogleApiCacheByHash(
    filter: $filter
    hash: $hash
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      hash
      id
      owner
      source
      updatedAt
      value
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ListGoogleApiCacheByHashQueryVariables,
    APITypes.ListGoogleApiCacheByHashQuery
  >;
export const listGoogleApiCaches = /* GraphQL */ `query ListGoogleApiCaches(
  $filter: ModelGoogleApiCacheFilterInput
  $limit: Int
  $nextToken: String
) {
  listGoogleApiCaches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      hash
      id
      owner
      source
      updatedAt
      value
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGoogleApiCachesQueryVariables,
  APITypes.ListGoogleApiCachesQuery
>;
export const listPreferences = /* GraphQL */ `query ListPreferences(
  $filter: ModelPreferencesFilterInput
  $limit: Int
  $nextToken: String
) {
  listPreferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      compactMode
      createdAt
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPreferencesQueryVariables,
  APITypes.ListPreferencesQuery
>;
export const listRotations = /* GraphQL */ `query ListRotations(
  $filter: ModelRotationFilterInput
  $limit: Int
  $nextToken: String
) {
  listRotations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      googlePlaceId
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRotationsQueryVariables,
  APITypes.ListRotationsQuery
>;
