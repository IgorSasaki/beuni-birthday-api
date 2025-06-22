import { Repository } from 'typeorm'

import { Gifts } from '@/entities/Gifts'

export class GiftsService {
  private repository: Repository<Gifts>

  constructor(repository: Repository<Gifts>) {
    this.repository = repository
  }

  public async createGiftRequest(gift: Gifts): Promise<Gifts> {
    return await this.repository.save(gift)
  }

  public async listGiftsByCreatedBy(userId: string) {
    const gifts = await this.repository.find({
      order: {
        createdAt: 'DESC'
      },
      relations: ['createdBy', 'sendTo'],
      where: {
        createdBy: {
          userId: userId
        }
      }
    })

    return gifts.map(gift => {
      const { password, ...safeUser } = gift.createdBy

      return {
        ...gift,
        createdBy: safeUser
      }
    })
  }

  public async getGiftById(giftId: string) {
    return await this.repository.findOne({
      relations: ['createdBy', 'sendTo'],
      where: { giftId: giftId }
    })
  }

  public async updateGiftStatus(giftId: string, status: string) {
    const gift = await this.repository.findOne({
      relations: ['createdBy', 'sendTo'],
      where: { giftId: giftId }
    })

    if (!gift) {
      throw new Error('Gift not found')
    }

    gift.status = status

    return await this.repository.save(gift)
  }
}
