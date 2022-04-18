import { Injectable, UnprocessableEntityException } from '@nestjs/common'

@Injectable()
export class PaginationService {
  async paginate(model, filter: any, options: any, response: any = {}) {
    try {
      if (!model) {
        throw new UnprocessableEntityException('Model not found or not paginatable')
      }

      const result = await model
        .find(filter, filter?.$text && { score: { $meta: 'textScore' } }, {
          limit: 10,
          skip: ((options?.page || 1) - 1) * 10,
          ...options,
        })
        .sort(filter?.$text ? { score: { $meta: 'textScore' } } : { createdAt: -1 })

      const totalDocs = await model.count(filter)

      if (response.set) {
        response.set(
          'meta',
          JSON.stringify({
            totalDocs: totalDocs,
            totalPages: Math.ceil(totalDocs / (filter?.limit || 10)),
          }),
        )
      }

      return result
    } catch (e) {
      throw new UnprocessableEntityException(e.message)
    }
  }
}
