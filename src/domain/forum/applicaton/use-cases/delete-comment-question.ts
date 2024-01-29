import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentsUseCaseRequest {
  authorId: string
  questionCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteQuestionCommentsUseCaseResponse {}

export class DeleteQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentsUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)
    if (!questionComment) {
      console.log(questionComment)
      throw new Error('Question Comment not found')
    }

    if (authorId !== questionComment.authorId.toString()) {
      throw new Error('Not Allowed')
    }

    await this.questionCommentsRepository.delete(questionComment)
    return {}
  }
}
