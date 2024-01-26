import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
    // attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new Error('Answer not found')
    }

    if (authorId !== answer.authorId.toValue()) {
      throw new Error('Not Allowed')
    }

    answer.content = content

    await this.answersRepository.save(answer)
    return {
      answer,
    }
  }
}
