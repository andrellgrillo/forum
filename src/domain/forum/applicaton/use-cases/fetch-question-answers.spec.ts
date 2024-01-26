import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answer-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })
  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('q1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('q1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('q1'),
      }),
    )
    const { answers } = await sut.execute({
      questionId: 'q1',
      page: 1,
    })
    expect(answers).toHaveLength(3)
  })
  it('should be able to fetch paginated question answers', async () => {
    for (let x = 1; x <= 22; x++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('q1'),
        }),
      )
    }
    const { answers } = await sut.execute({
      questionId: 'q1',
      page: 2,
    })
    expect(answers).toHaveLength(2)
  })
})