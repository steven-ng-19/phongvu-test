import { BadRequestException, Injectable } from '@nestjs/common';
import { PRODUCT_MODEL } from 'src/modules/products/models';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_MODEL, OrderItem } from '../models';
import { Model } from 'mongoose';
import { ProductDocument } from 'src/modules/products/entities';
import { StripeService } from 'src/modules/stripe/services';
import { CreateOrderDto } from '../dto';
import { OrderDocument } from '../entities';
import { User } from 'src/modules/users/models';
import { OrderStatus } from 'src/common/enums';
import Stripe from 'stripe';
import { OrderQueryParams, StatisticsQueryParams } from 'src/shared/types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(PRODUCT_MODEL) private productModel: Model<ProductDocument>,
    @InjectModel(ORDER_MODEL) private orderModel: Model<OrderDocument>,
    private stripeService: StripeService,
  ) {}

  async createOrder(data: CreateOrderDto, user: User) {
    try {
      const orderItems = [];
      let totalPrice = 0;

      const { items, ...orderData } = data;
      await Promise.all(
        items.map(async (item) => {
          const { productId, quantity = 1 } = item;
          const product = await this.productModel.findById(productId).lean();
          if (!product) throw new Error('Product not found');
          if (quantity > product.quantity)
            throw new Error('Product out of stock');

          const orderItemData: OrderItem = {
            product,
            quantity,
            discount: 0,
            totalPrice: product.price * quantity,
            totalPriceWithDiscount: product.price * quantity,
          };
          totalPrice += orderItemData.totalPrice;
          orderItems.push(orderItemData);
        }),
      );

      return this.orderModel.create({
        ...orderData,
        totalPrice,
        items: orderItems,
        user: user,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkoutOrder(orderId: string, paymentMethodId: string, user: User) {
    try {
      const { customerId } = user;
      const order = await this.orderModel.findById(orderId);

      if (!order) throw new Error('Order not found');
      if (order.status !== OrderStatus.PENDING)
        throw new Error('Order is not pending');

      const { totalPrice: amount } = order;
      const paymentIntent = await this.stripeService.createPaymentIntent({
        customerId,
        paymentMethodId,
        amount,
        metadata: { orderId },
      });
      const charge = await this.stripeService.retrieveCharge(
        paymentIntent.latest_charge as string,
      );
      const { id: paymentIntentId, status: paymentIntentStatus } =
        paymentIntent;

      if (
        paymentIntentStatus.toString() !== 'succeeded' ||
        charge.status !== 'succeeded'
      )
        throw new Error('Payment failed');

      return this.orderModel.findByIdAndUpdate(
        orderId,
        {
          status: OrderStatus.PAID,
          paymentId: paymentIntentId,
          paymentDetails: paymentIntent,
        },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOrders(query: OrderQueryParams, populate: string[] = []) {
    const {
      page = 1,
      limit = 10,
      // search = '',
      sort = { createdAt: 'desc' },
      where = {},
    } = query;

    const queryObj: Record<string, unknown> = {
      ...where,
    };

    const [orders, count] = await Promise.all([
      this.orderModel
        .find(queryObj, null, { limit, skip: (page - 1) * limit })
        .select(['-items'])
        .populate(populate)
        .sort(sort)
        .lean(),
      this.orderModel.countDocuments(queryObj),
    ]);

    return {
      page,
      limit,
      totalRow: count,
      totalPage: Math.ceil(count / limit),
      data: orders,
    };
  }

  async getOrder(orderId: string, populate: string[] = []) {
    return this.orderModel.findById(orderId).populate(populate).lean();
  }

  async getOrderStatistics(
    query?: StatisticsQueryParams,
  ): Promise<{ total: number; pending: number; paid: number }> {
    const { where: { fromDate, toDate } = { fromDate: null, toDate: null } } =
      query;

    const matchCondition: Record<string, unknown> = {};
    // Filter by date
    if (fromDate && toDate) {
      matchCondition.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else {
      if (fromDate) {
        matchCondition.createdAt = { $gte: new Date(fromDate) };
      }

      if (toDate) {
        matchCondition.createdAt = { $lte: new Date(toDate) };
      }
    }

    const result = await this.orderModel.aggregate([
      { $match: matchCondition },
      {
        $facet: {
          total: [{ $count: 'count' }],
          pending: [
            { $match: { status: { $eq: OrderStatus.PENDING } } },
            { $count: 'count' },
          ],
          paid: [
            { $match: { status: { $eq: OrderStatus.PAID } } },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ['$total.count', 0] },
          pending: { $arrayElemAt: ['$pending.count', 0] },
          paid: { $arrayElemAt: ['$paid.count', 0] },
        },
      },
      {
        $addFields: {
          total: { $ifNull: ['$total', 0] },
          pending: { $ifNull: ['$pending', 0] },
          paid: { $ifNull: ['$paid', 0] },
        },
      },
    ]);

    return result[0];
  }

  async getRevenueStatistics(query?: StatisticsQueryParams): Promise<any> {
    const { where: { fromDate, toDate } = { fromDate: null, toDate: null } } =
      query;

    const matchCondition: Record<string, unknown> = {};
    // Filter by date
    if (fromDate && toDate) {
      matchCondition.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else {
      if (fromDate) {
        matchCondition.createdAt = { $gte: new Date(fromDate) };
      }

      if (toDate) {
        matchCondition.createdAt = { $lte: new Date(toDate) };
      }
    }

    const results = await this.orderModel.aggregate([
      { $match: matchCondition },
      {
        $project: {
          status: 1,
          totalPrice: 1,
          pending: {
            $cond: [
              { $eq: ['$status', OrderStatus.PENDING] },
              '$totalPrice',
              0,
            ],
          },
          paid: {
            $cond: [{ $eq: ['$status', OrderStatus.PAID] }, '$totalPrice', 0],
          },
        },
      },
      {
        $group: {
          _id: '',
          pending: { $sum: '$pending' },
          paid: { $sum: '$paid' },
          total: { $sum: '$totalPrice' },
        },
      },
      {
        $addFields: {
          total: { $ifNull: ['$total', 0] },
          pending: { $ifNull: ['$pending', 0] },
          paid: { $ifNull: ['$paid', 0] },
        },
      },
    ]);

    if (!results.length) return { total: 0, pending: 0, paid: 0 };

    const result = results[0];
    delete result._id;

    return result;
  }
}
