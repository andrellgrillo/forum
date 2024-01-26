import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/applicaton/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)
    if (!answer) {
      return null
    }
    return answer
  }

  async findManyByQuestionId(questionID: string, { page }: PaginationParams) {
    const answer = this.items
      .filter((item) => item.questionId.toString() === questionID)
      .slice((page - 1) * 20, page * 20)
    return answer
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(itemIndex, 1)
  }
}
