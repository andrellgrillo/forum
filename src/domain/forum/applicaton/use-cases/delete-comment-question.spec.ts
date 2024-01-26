import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionCommentsUseCase } from './delete-comment-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentsUseCase

describe('Delete on Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new DeleteQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to comment on question', async () => {
    const questionComment = makeQuestionComment({
      questionId: new UniqueEntityID('q1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    console.log(inMemoryQuestionCommentsRepository.items.length)

    await sut.execute({
      questionCommentId: 'q1',
      authorId: questionComment.authorId.toString(),
    })

    console.log(inMemoryQuestionCommentsRepository.items.length)

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })
})
