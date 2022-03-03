import { IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationMetaParams {
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDocs?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPages?: number
}
