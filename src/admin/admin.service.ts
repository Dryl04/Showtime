import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Group, GroupDocument } from '../groups/schemas/group.schema';
import { Concert, ConcertDocument } from '../concerts/schemas/concert.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';

export interface DashboardKPIs {
  totalUsers: number;
  totalGroups: number;
  totalConcerts: number;
  totalBookings: number;
  totalRevenue: number;
  ticketsSold: number;
  ticketsAvailable: number;
  recentBookings: number; // derniers 7 jours
  upcomingConcerts: number;
}

export interface RecentActivity {
  type: 'booking' | 'user' | 'concert';
  message: string;
  date: Date;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalGroups,
      totalConcerts,
      totalBookings,
      recentBookings,
      concerts,
      bookings,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.groupModel.countDocuments(),
      this.concertModel.countDocuments(),
      this.bookingModel.countDocuments(),
      this.bookingModel.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      }),
      this.concertModel.find().exec(),
      this.bookingModel.find().exec(),
    ]);

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.total_price,
      0,
    );

    const ticketsSold = concerts.reduce(
      (sum, concert) => sum + concert.ticket_sold,
      0,
    );

    const ticketsAvailable = concerts.reduce(
      (sum, concert) => sum + concert.ticket_left,
      0,
    );

    const now = new Date();
    const upcomingConcerts = concerts.filter(
      (concert) => concert.date > now,
    ).length;

    return {
      totalUsers,
      totalGroups,
      totalConcerts,
      totalBookings,
      totalRevenue,
      ticketsSold,
      ticketsAvailable,
      recentBookings,
      upcomingConcerts,
    };
  }

  async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    const [recentBookings, recentUsers, recentConcerts] = await Promise.all([
      this.bookingModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user_id', 'name')
        .populate('concert_id', 'name_concert')
        .exec(),
      this.userModel.find().sort({ createdAt: -1 }).limit(limit).exec(),
      this.concertModel.find().sort({ createdAt: -1 }).limit(limit).exec(),
    ]);

    const activities: RecentActivity[] = [];

    recentBookings.forEach((booking) => {
      activities.push({
        type: 'booking',
        message: `Nouvelle réservation de ${booking.quantity} ticket(s)`,
        date: booking.createdAt,
      });
    });

    recentUsers.forEach((user) => {
      activities.push({
        type: 'user',
        message: `Nouvel utilisateur : ${user.name}`,
        date: user.createdAt,
      });
    });

    recentConcerts.forEach((concert) => {
      activities.push({
        type: 'concert',
        message: `Nouveau concert : ${concert.name_concert}`,
        date: (concert as any).createdAt || new Date(),
      });
    });

    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
}
