import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface ChooseQuestionBestAnswerCaseResquest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class ChooseQuestionBestAnswerCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerCaseResquest): Promise<ChooseQuestionBestAnswerCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError())
    }
    question.bestAnswerId = new UniqueEntityID(answerId)
    await this.questionsRepository.save(question)
    return right({
      question,
    })
  }
}
