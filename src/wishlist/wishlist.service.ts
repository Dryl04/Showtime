import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
  ) {}

  async getOrCreateWishlist(userId: string): Promise<WishlistDocument> {
    let wishlist = await this.wishlistModel.findOne({
      user_id: new Types.ObjectId(userId),
    });

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({
        user_id: new Types.ObjectId(userId),
        group_ids: [],
        concert_ids: [],
      });
    }

    return wishlist;
  }

  async getUserWishlist(userId: string): Promise<WishlistDocument | null> {
    const wishlist = await this.wishlistModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('group_ids', 'name genre picture_url')
      .populate('concert_ids', 'name date place price')
      .exec();

    if (!wishlist) {
      return await this.getOrCreateWishlist(userId);
    }

    return wishlist;
  }

  async getUserWishlistWithDetails(userId: string): Promise<{
    groups: any[];
    concerts: any[];
  }> {
    const wishlist = await this.wishlistModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('group_ids')
      .populate('concert_ids')
      .exec();

    if (!wishlist) {
      return { groups: [], concerts: [] };
    }

    return {
      groups: wishlist.group_ids || [],
      concerts: wishlist.concert_ids || [],
    };
  }

  async addGroup(userId: string, groupId: string): Promise<WishlistDocument> {
    const wishlist = await this.getOrCreateWishlist(userId);

    const updated = await this.wishlistModel.findByIdAndUpdate(
      String(wishlist._id),
      {
        $addToSet: { group_ids: new Types.ObjectId(groupId) },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return updated!;
  }

  async removeGroup(
    userId: string,
    groupId: string,
  ): Promise<WishlistDocument> {
    const wishlist = await this.getOrCreateWishlist(userId);

    const updated = await this.wishlistModel.findByIdAndUpdate(
      String(wishlist._id),
      {
        $pull: { group_ids: new Types.ObjectId(groupId) },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return updated!;
  }

  async addConcert(
    userId: string,
    concertId: string,
  ): Promise<WishlistDocument> {
    const wishlist = await this.getOrCreateWishlist(userId);

    const updated = await this.wishlistModel.findByIdAndUpdate(
      String(wishlist._id),
      {
        $addToSet: { concert_ids: new Types.ObjectId(concertId) },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return updated!;
  }

  async removeConcert(
    userId: string,
    concertId: string,
  ): Promise<WishlistDocument> {
    const wishlist = await this.getOrCreateWishlist(userId);

    const updated = await this.wishlistModel.findByIdAndUpdate(
      String(wishlist._id),
      {
        $pull: { concert_ids: new Types.ObjectId(concertId) },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return updated!;
  }

  async hasGroup(userId: string, groupId: string): Promise<boolean> {
    const wishlist = await this.getOrCreateWishlist(userId);
    return wishlist.group_ids.some(
      (id) => id.toString() === groupId.toString(),
    );
  }

  async hasConcert(userId: string, concertId: string): Promise<boolean> {
    const wishlist = await this.getOrCreateWishlist(userId);
    return wishlist.concert_ids.some(
      (id) => id.toString() === concertId.toString(),
    );
  }

  async clearWishlist(userId: string): Promise<void> {
    await this.wishlistModel.deleteOne({
      user_id: new Types.ObjectId(userId),
    });
  }
  async getUsersWithFavoriteGroup(groupId: string): Promise<string[]> {
    const wishlists = await this.wishlistModel
      .find({
        group_ids: new Types.ObjectId(groupId),
      })
      .select('user_id')
      .exec();

    return wishlists.map((w) => w.user_id.toString());
  }

  async getUsersWithFavoriteGroupByName(groupName: string): Promise<string[]> {
    const wishlists = await this.wishlistModel
      .find()
      .populate('group_ids', 'name')
      .exec();

    const matchingWishlists = wishlists.filter((wishlist) => {
      return wishlist.group_ids.some(
        (group: any) => group && group.name === groupName,
      );
    });

    return matchingWishlists.map((w) => w.user_id.toString());
  }

  // Récupérer tous les utilisateurs qui ont un concert spécifique en favori
  // (Guys, ...)
  async getUsersWithFavoriteConcert(concertId: string): Promise<string[]> {
    const wishlists = await this.wishlistModel
      .find({
        concert_ids: new Types.ObjectId(concertId),
      })
      .select('user_id')
      .exec();

    return wishlists.map((w) => w.user_id.toString());
  }
}
