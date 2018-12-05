const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const resolvers = require('../resolvers')
const Curso = require('./Curso')
const Profesor = require('./Profesor')

const rootQuery = `
  union ResultadoBusqueda = Profesor | Curso

  type Query {
    cursos: [Curso]
    profesores: [Profesor]
    comentarios: [Comentario]
    curso(id: Int): Curso
    profesor(id: Int): Profesor
    comentario(id: Int): Comentario
    buscar(query: String!): [ResultadoBusqueda]

  }

  type Mutation {
    profesorAdd(profesor: NuevoProfesor): Profesor
    profesorEdit(profesorId: Int!, profesor: ProfesorEditable): Profesor
    profesorDelete(profesorId: Int!): Profesor
    cursoAdd(curso: NuevoCurso): Curso
    cursoEdit(cursoId: Int!, curso: cursoEditable): Curso
    cursoDelete(cursoId: Int!): Curso
    comentarioAdd(comentario: NuevoComentario): Comentario
    comentarioEdit(comentarioId: Int!, comentario: comentarioEditable): Comentario
    comentarioDelete(comentarioId: Int!): Comentario
  }

  type Subscription {
    Profesor: ProfesorSubscriptionPayload
  }
`

const schema = makeExecutableSchema({
  typeDefs: [rootQuery, Profesor, Curso],
  resolvers
})

module.exports = schema
