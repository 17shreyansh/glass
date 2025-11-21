import React from 'react';
import { Card, Typography } from 'antd';
import './CheckoutStep.css';

const { Text } = Typography;

const CartSummary = ({ subtotal = 0, shipping = 0, couponDiscount = 0, wallet = 0, netTotal = 0 }) => {
  return (
    <div>
      <Card className="summary-card">
        <div className="summary-row">
          <div>ITEM(S) SUBTOTAL :</div>
          <div>₹{subtotal.toLocaleString()}</div>
        </div>

        <div className="divider-line" />

        <div className="summary-row">
          <div>SHIPPING :</div>
          <div>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</div>
        </div>

        <div className="divider-line" />

        <div className="summary-row">
          <div>TOTAL :</div>
          <div>₹{subtotal.toLocaleString()}</div>
        </div>

        <div className="divider-line" />

        <div className="summary-row">
          <div>COUPON | PROMO APPLIED:</div>
          <div>-₹{couponDiscount.toLocaleString()}</div>
        </div>

        <div className="divider-line" />

        <div className="summary-row">
          <div>WALLET:</div>
          <div>-₹{wallet.toLocaleString()}</div>
        </div>

        <div className="divider-line" />

        <div className="summary-row net-row">
          <div>NET FINAL AMOUNT :</div>
          <div>₹{netTotal.toLocaleString()}</div>
        </div>
      </Card>
    </div>
  );
};

export default CartSummary;
