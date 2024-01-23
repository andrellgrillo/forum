import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionRepository } from '../../../../test/repositories/in-memory-question-repository'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })
  it('should be able to get', async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityID(),
      title: 'Example question',
      slug: Slug.create('example-question'),
      content: 'Example content',
    })
    await inMemoryQuestionRepository.create(newQuestion)
    const { question } = await sut.execute({
      slug: 'example-question',
    })
    expect(question.title).toBeTruthy()
  })
})
