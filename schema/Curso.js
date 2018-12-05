module.exports = `
  type Curso {
    id: ID!
    titulo: String!
    descripcion: String!
    profesor: Profesor
    rating: Float
    comentarios: [Comentario]
  }

  type Comentario {
    id: ID!
    nombre: String!
    cuerpo: String!
    curso: Curso
  }

  input NuevoCurso {
    titulo: String!
    descripcion: String!
  }

  input cursoEditable {
    titulo: String
    descripcion: String
  }

  input NuevoComentario {
    nombre: String!
    cuerpo: String!
  }

  input comentarioEditable {
    nombre: String
    cuerpo: String
  }
`
