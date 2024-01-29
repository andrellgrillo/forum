import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })
  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)
    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })
    expect(inMemoryQuestionRepository.items).toHaveLength(0)
  })
  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)
    const result = await sut.execute({
      questionId: 'question-2',
      authorId: 'authot-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
