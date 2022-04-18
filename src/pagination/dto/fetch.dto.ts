import { Type } from 'class-transformer'

export class FetchDto {
  search?: string

  @Type(() => Number)
  page?: number

  @Type(() => Number)
  limit?: number
}
