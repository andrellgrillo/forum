import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface SendNotificationsUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

type SendNotificationsUseCaseResponse = Either<
  null,
  { notification: Notification }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationsUseCaseRequest): Promise<SendNotificationsUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })
    await this.notificationsRepository.create(notification)
    return right({
      notification,
    })
  }
}
