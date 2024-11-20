"use client";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Pos() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const products: Product[] = [
    { id: 1, name: "아메리카노", price: 4500 },
    { id: 2, name: "카페라떼", price: 5000 },
    { id: 3, name: "콜드브루", price: 5000 },
    { id: 4, name: "바닐라라떼", price: 5500 },
    { id: 5, name: "요거트스무디", price: 6000 },
    { id: 6, name: "레몬에이드", price: 4000 },
    { id: 7, name: "샌드위치", price: 6000 },
    { id: 8, name: "머핀", price: 3000 },
    { id: 9, name: "마들렌", price: 3000 },
    { id: 10, name: "마카롱", price: 2000 },
  ];

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setTotal((prevTotal) => prevTotal + product.price);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    const removedProduct = cart.find((item) => item.id === id);
    if (removedProduct) {
      setTotal((prevTotal) => prevTotal - removedProduct.price);
    }
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      // 기존 저장된 결제 내역 가져오기
      const previousTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");

      // 새로운 결제 내역 추가
      const newTransaction = [...previousTransactions, { cart, total, date:new Date().toISOString()}];
      localStorage.setItem("transactions", JSON.stringify(newTransaction));

      setCart([]); 
      setTotal(0); 
      setCheckoutMessage("결제가 완료되었습니다."); 

      // 2초 후 메시지 숨기기
      setTimeout(() => {
        setCheckoutMessage(null);
      }, 2000);
    }
  };


  return (
    <div className="container flex flex-col overflow-y-auto ">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">POS 시스템</h1>
        <Link
          href ={"/poslist"} className="p-2 rounded-md bg-slate-200">
            결제내역
        </Link>
      </div>

      <div className="flex mb-5 justify-center">
        <div className="grid grid-cols-2 gap-5 bg-gray-50 p-4 w-full">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className=" p-5 bg-white rounded-lg shadow text-center "
            >
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-gray-500">{product.price.toLocaleString()}원</p>
            </button>
          ))}
        </div>
      </div>

      
      <div className="bg-gray-100 p-4 ">
        <h2 className="text-lg font-bold mb-2">주문내역</h2>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <div>
                  <span className="font-bold">{item.name}</span>
                  <span className="ml-2 text-gray-500 text-xs">
                    {item.price.toLocaleString()}원
                  </span>
                  <span className="ml-2 text-gray-500 text-xs">x {item.quantity}</span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 font-bold"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        
        <div className="mt-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">총합: {total.toLocaleString()}원</h3>
          <button
            onClick={handleCheckout}
            className="p-3 bg-emerald-500 text-white rounded-md shadow"
          >
            결제하기
          </button>
        </div>
      </div>
      {checkoutMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          {checkoutMessage}
        </div>
      )}
    </div>
  );
}
