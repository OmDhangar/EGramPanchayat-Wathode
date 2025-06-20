// payment.controller.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Application } from '../models/application.model.js';
import { Payment } from '../models/payment.model.js';

dotenv.config();

// Ensure Razorpay credentials are set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are not set in environment variables');
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
const createOrder = async (req, res) => {
  try {
    const { applicationId, amount } = req.body;
    const userId = req.user.id;

    // Validate application
    const application = await Application.findOne({
      applicationId,
      applicantId: userId,
      status: 'certificate_generated'
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or not in valid status for payment'
      });
    }

    // Prevent duplicate payment
    const existingPayment = await Payment.findOne({
      applicationId,
      status: 'completed'
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this application'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // INR to paise
      currency: 'INR',
      receipt: `${applicationId}_${Date.now()}`.slice(0, 40), // Razorpay max 40 chars
      notes: {
        applicationId,
        userId,
        certificateType: application.documentType
      }
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      applicationId,
      userId,
      orderId: order.id,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
      createdAt: new Date()
    });

    await payment.save();

    // Update application payment details
    application.paymentDetails = {
      paymentStatus: 'pending',
      paymentAmount: amount,
      orderId: order.id
    };
    await application.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        applicationId
      }
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId
    } = req.body;

    const userId = req.user.id;

    // Generate signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Validate signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update payment
    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      userId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'completed';
    payment.paidAt = new Date();
    await payment.save();

    // Update application payment status only
    const application = await Application.findOne({
      applicationId,
      applicantId: userId
    });

    if (application) {
      application.paymentDetails = {
        ...application.paymentDetails,
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        paymentDate: new Date()
      };
      await application.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      applicationId,
      userId
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        payment: {
          id: payment._id,
          applicationId: payment.applicationId,
          amount: payment.amount,
          status: payment.status,
          paymentId: payment.paymentId,
          createdAt: payment.createdAt,
          paidAt: payment.paidAt
        }
      }
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status'
    });
  }
};

export {
  createOrder,
  verifyPayment,
  getPaymentStatus
};
