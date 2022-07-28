import gql from 'graphql-tag';

export default gql`
	extend type Query {
		connected: Boolean!
		loading: Boolean!
		darkMode: Boolean!
		currentProjectId: String
	}
  extend type Mutaion {
    connectedSet (value: Boolean!): Boolean
    loadingChange (value: Int!): Boolean
    darkModeSet (value: Boolean!): Boolean
    currentProjectIdSet (value: String): Boolean
  }
`;
