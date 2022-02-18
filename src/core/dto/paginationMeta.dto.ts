import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationMetaParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalDocs?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPages?: number
}
