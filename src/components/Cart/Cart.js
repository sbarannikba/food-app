import React, { useContext, useState } from 'react';
import useHttp from './../hooks/use-http';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';


const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);
  const { isLoading: isRequestLoading, error: requestOrderError, sendRequest: placeOrder } = useHttp();

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const onCheckoutSubmit = (customerData) => {
    
    const orderData = {
      date: new Date().toLocaleDateString("en-US"),
      user: customerData,
      orderedItems: cartCtx.items
    };

    placeOrder(
      {
        url: 'https://react-http-d468c-default-rtdb.europe-west1.firebasedatabase.app/orders.json',
        method: 'POST',
        body: orderData
      },
      (response) => {
        if(response) {
          setDidSubmit(true);
          cartCtx.clearCart();
        };
      }
    );
  };

  let content = (
    <React.Fragment>
        {cartItems}
        <div className={classes.total}>
          <span>Total Amount</span>
          <span>{totalAmount}</span>
        </div>
        <div className={classes.actions}>
          <button className={classes['button--alt']} onClick={props.onClose}>
            Close
          </button>
          {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
      </React.Fragment>
  );
  
  if(isCheckout) {
    content = <Checkout onCheckoutSubmit={onCheckoutSubmit} onCancel={props.onClose} />;
  }

  if(isRequestLoading) {
    content = <p>Sending order data...</p>;
  }

  if(requestOrderError) {
    content = <p>Sending order data error</p>;
  }

  if(didSubmit) {
    content =( 
      <React.Fragment>
        <p>Thank you for your order</p>
        <div className={classes.actions}>
          <button onClick={props.onClose}>Close</button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <Modal onClose={props.onClose}>
      {content}
    </Modal>
  );
};

export default Cart;
