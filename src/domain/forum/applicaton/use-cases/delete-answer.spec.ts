import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })
  it('should be able to delete a Answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('Answer-1'),
    )
    await inMemoryAnswerRepository.create(newAnswer)
    await sut.execute({
      answerId: 'Answer-1',
      authorId: 'author-1',
    })
    expect(inMemoryAnswerRepository.items).toHaveLength(0)
  })
  it('should not be able to delete a Answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('Answer-1'),
    )
    await inMemoryAnswerRepository.create(newAnswer)
    const result = await sut.execute({
      answerId: 'Answer-2',
      authorId: 'authot-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
