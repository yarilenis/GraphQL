const Curso = require('./models/Curso')
const Profesor = require('./models/Profesor')
const Comentario = require('./models/Comentario')
const { PubSub, withFilter } = require('graphql-subscriptions');

const pubsub = new PubSub();
const resolvers = {
    Query: {
      cursos: () => Curso.query().eager('[profesor, comentarios]'),
      profesores: () => Profesor.query().eager('cursos'),
      comentarios: () => Comentario.query().eager('curso'),
      curso: (rootValue, args) => Curso.query().eager('[profesor, comentarios]').findById(args.id),
      profesor: (rootValue, args) => Profesor.query().eager('cursos').findById(args.id),
      comentario: (rootValue, args) => Comentario.query().eager('curso').findById(args.id),
      buscar: (_, args) => {
        return [
          Profesor.query().findById(3),
          Curso.query().findById(1)
        ]
      },

    },
    ResultadoBusqueda: {
      __resolveType: (obj) => {
        if(obj.nombre) return 'Profesor'
        return 'Curso'
      }
    },
    Mutation: {
      profesorAdd: async (_, args) => {
        const profesor = await Profesor.query().insert(args.profesor);
        pubsub.publish('profesorChanged', { Profesor: {mutation: 'CREATED', node: profesor}})
        return profesor
      },
      profesorEdit: async (_, args) => {
        const profesorOld = await Profesor.query().findById(args.profesorId)
        const profesor = await Profesor.query().patchAndFetchById(args.profesorId, args.profesor)
        pubsub.publish('profesorChanged', { Profesor: {mutation: 'UPDATED', node: profesor, previousValues: profesorOld}})
        return profesor
      },
      profesorDelete: (_, args) => {
        return Profesor.query().findById(args.profesorId).then((profesor) => {
          return Profesor.query().deleteById(args.profesorId).then((filasBorradas) => {
            if(filasBorradas > 0){

              return profesor
            }
            throw new Error(`El profesor con id ${args.profesorId} no se pudo eliminar`)
          })
        })
      },
      cursoAdd: (_, args) => {
        return Curso.query().insert(args.curso)
      },
      cursoEdit: (_, args) => {
        return Curso.query().patchAndFetchById(args.cursoId, args.curso)
      },
      cursoDelete: (_, args) => {
        return Curso.query().findById(args.cursoId).then((curso) => {
          return Curso.query().deleteById(args.cursoId).then(() => curso)
        })
      },
      comentarioAdd: (_, args) => {
        return Comentario.query().insert(args.comentario)
      },
      comentarioEdit: (_, args) => {
        return Comentario.query().patchAndFetchById(args.comentarioId, args.comentario)
      },
      comentarioDelete: (_, args) => {
        return Comentario.query().findById(args.comentarioId).then((comentario) => {
          return Comentario.query().deleteById(args.comentarioId).then(() => comentario)
        })
      }
    },
    Subscription: {
        Profesor: {
            subscribe: () => pubsub.asyncIterator('profesorChanged')
        }
    }
}

module.exports = resolvers;
