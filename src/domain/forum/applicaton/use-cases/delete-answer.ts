import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {}
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    // attachmentsIds,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)
    return right({})
  }
}
