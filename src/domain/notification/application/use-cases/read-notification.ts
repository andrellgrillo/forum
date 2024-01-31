import { Either, left, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface ReadNotificationsUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationsUseCaseRequest): Promise<ReadNotificationsUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({ notification })
  }
}
