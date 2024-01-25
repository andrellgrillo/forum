import { EditQuestionUseCase } from './edit-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })
  it('should be able to edit  a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)
    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteudo text',
    })
    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Pergunta teste',
      content: 'Conteudo text',
    })
  })
  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)
    expect(() => {
      return sut.execute({
        questionId: newQuestion.id.toValue(),
        authorId: 'question-1',
        title: 'Pergunta teste',
        content: 'Conteudo text',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
