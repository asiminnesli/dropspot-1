/**
 * Architectural migration: Replace role-segmented REST controllers with a unified GraphQL API schema.
 * Unifies admin and regular drop queries/mutations into a single type-safe schema.
 */
export const typeDefs = `
  type Drop {
    id: ID!
    title: String!
    claimed: Boolean!
  }

  type Query {
    drops: [Drop!]!
    adminDrops(filter: String): [Drop!]!
  }

  type Mutation {
    claimDrop(dropId: ID!): Drop!
    adminPurgeDrop(dropId: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    drops: async () => [],
    adminDrops: async () => [],
  },
};
