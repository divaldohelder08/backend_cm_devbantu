import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/_errors/bad-request-error'
import api from '@/lib/axios'
import { auth } from '@/routes/middlewares/auth'
import { getError } from '@/utils/error-utils'

export async function getFuncionario(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/:id',
      {
        schema: {
          tags: ['RH', 'Funcionario'],
          summary: 'Buscar funcionario pelo id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.coerce.number(),
          }),
          response: {
            200: z.any(),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        await request.verifyPermission('read-funcionario')
        try {
          const { data } = await api.get(`/funcionario/${id}`)
          return reply.code(200).send(data)
        } catch (error) {
          const { message } = getError(error)
          throw new BadRequestError(message)
        }
      },
    )
}
