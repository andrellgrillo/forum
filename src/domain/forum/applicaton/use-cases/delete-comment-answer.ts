import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentsUseCaseRequest {
  authorId: string
  answerCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteAnswerCommentsUseCaseResponse {}

export class DeleteAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentsUseCaseRequest): Promise<DeleteAnswerCommentsUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)
    if (!answerComment) {
      console.log(answerComment)
      throw new Error('Answer Comment not found')
    }

    if (authorId !== answerComment.authorId.toString()) {
      throw new Error('Not Allowed')
    }

    await this.answerCommentsRepository.delete(answerComment)
    return {}
  }
}
