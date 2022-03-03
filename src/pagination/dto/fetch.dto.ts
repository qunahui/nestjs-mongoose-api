import { IsNumber, Max, Min } from 'class-validator'

export class FetchDto {
  search?: string

  @IsNumber()
  @Min(1)
  page?: number

  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number
}
