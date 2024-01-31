/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface DeleteQuestionCommentsUseCaseRequest {
  authorId: string
  questionCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentsUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)
    if (!questionComment) {
      // console.log(questionComment)
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)
    return right({})
  }
}
