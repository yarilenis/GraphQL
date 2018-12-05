module.exports = `
  type Profesor {
      id: ID!
      nombre: String!
      nacionalidad: String!
      genero: Genero
      cursos: [Curso]
  }

  enum Genero {
    MASCULINO
    FEMENINO
  }

  input NuevoProfesor {
    nombre: String!
    genero: Genero
    nacionalidad: String!
  }

  input ProfesorEditable {
    nombre: String
    genero: Genero
    nacionalidad: String
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }

  type ProfesorSubscriptionPayload {
    mutation: _ModelMutationType
    node: Profesor
    previousValues: Profesor
  }
`
