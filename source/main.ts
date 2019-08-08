import { ApolloServer } from "apollo-server"
import { ObjectId } from "mongodb"
import { connect } from "mongoose"
import * as path from "path"
import "reflect-metadata"
import { buildSchema } from "type-graphql"

import TicketsAPI from './components/ticket/TicketsApi.datasource'
import config from './config'
import { ObjectIdScalar } from "./objectId.scalar"
import typegooseMiddleware from "./typegooseMiddleware"

const { GRAPHQL_PORT, MONGO } = config

// mongo uri
const { name, host, port } = MONGO;
export const MONGODB_URI = `mongodb://${host}:${port}/${name}`

const main = async () => {
  try {
    await connect(
      MONGODB_URI,
      { useNewUrlParser: true },
    )
  } catch (mongoConnectError) {
    console.error(mongoConnectError)
  }
  try {
    const schema = await buildSchema({
      resolvers: [`${__dirname}/components/**/*.resolver.ts`],
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      globalMiddlewares: [typegooseMiddleware],
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    })
    const server = new ApolloServer({
      schema,
      context: {},
      dataSources: () => ({
          ticketsAPI: new TicketsAPI()
      })
    })
    const { url } = await server.listen(GRAPHQL_PORT)
    console.log(`GraphQL Playground running at ${url}`)
  } catch (apolloError) {
    console.error(apolloError)
  }
}

main()
