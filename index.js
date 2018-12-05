const express = require('express')
const bodyParser = require('body-parser')
const { execute, subscribe }  = require('graphql')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const schema = require('./schema')

require('./db/setup')
const PORT = 5678
const app = express()

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    formatError: (error) => {
      return{
        codigo: 'A43',
        name: error.name,
        mensaje: error.message
      }
    }
   })
)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  })
)

const ws = createServer(app);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
