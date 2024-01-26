import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerCaseResquest {
  authorId: string
  answerId: string
}

interface ChooseQuestionBestAnswerCaseResponse {
  question: Question
}

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
      throw new Error('Answer not found')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      throw new Error('Question not found')
    }

    if (authorId !== question.authorId.toValue()) {
      throw new Error('Not allowed')
    }
    question.bestAnswerId = new UniqueEntityID(answerId)
    await this.questionsRepository.save(question)
    return {
      question,
    }
  }
}
