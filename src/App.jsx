import { useEffect, useMemo, useState } from "react";
import "./style.css";

/* =========================================================
   PRODUCT DATA
   ========================================================= */

const products = [
  {
    id: 1,
    name: "Mangodi",
    image: "/images/mangodi.jpg",
    tag: "BESTSELLER",
    description: "Traditional Rajasthani taste.",
    prices: {
      "250g": 70,
      "500g": 130,
      "1kg": 240,
    },
  },

  {
    id: 2,
    name: "Banana Chips",
    image: "/images/chips.jpg",
    tag: "CRISPY FAVOURITE",
    description: "Light, crispy and crunchy.",
    prices: {
      "250g": 110,
      "500g": 210,
      "1kg": 390,
    },
  },

  {
    id: 3,
    name: "Namkeen",
    image: "/images/namkeen.jpg",
    tag: "TEA-TIME PICK",
    description: "Perfect tea-time snack.",
    prices: {
      "250g": 70,
      "500g": 130,
      "1kg": 240,
    },
  },
];


/* =========================================================
   CUSTOMER DETAILS
   ========================================================= */

const emptyCustomer = {
  name: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};


/* =========================================================
   MAIN APP
   ========================================================= */

function App() {

  const [page, setPage] = useState("home");
const [apiProducts, setApiProducts] = useState([]);
const [loading, setLoading] = useState(true);
const displayProducts =

  apiProducts.length > 0
    ? apiProducts.map((product) => {
        const oldProduct = products.find(
          (item) => item.id === product.id
        );

        return {
          ...product,
          image: oldProduct?.image,
          tag: oldProduct?.tag,
        };
      })
    : products;
useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((response) => response.json())
    .then((data) => {
      setApiProducts(data);
      console.log("Products from Backend:", data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Backend Error:", error);
      setLoading(false);
    });
}, []);
  const [cart, setCart] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [selectedWeight, setSelectedWeight] =
    useState("250g");

  const [customerDetails, setCustomerDetails] =
    useState(emptyCustomer);

  const [paymentMethod, setPaymentMethod] =
    useState("Online Payment");

  const [orderId, setOrderId] =
    useState("");
    const [orderItems, setOrderItems] = useState([]);


  const [lastOrderTotal, setLastOrderTotal] =
    useState(0);
const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  /* =======================================================
     CART TOTAL
     ======================================================= */

  const cartTotal = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

  }, [cart]);


  /* =======================================================
     NAVIGATION
     ======================================================= */

  const goHome = () => {

    setPage("home");

    setSelectedProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const goProducts = () => {

    setPage("products");

    setSelectedProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const goTo = (nextPage) => {

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =======================================================
     OPEN PRODUCT
     ======================================================= */

  const openProduct = (product) => {

    setSelectedProduct(product);

    setSelectedWeight("250g");

    setPage("detail");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =======================================================
     ADD TO CART
     ======================================================= */

  const addToCart = () => {

    if (!selectedProduct) return;

    const price =
      selectedProduct.prices[selectedWeight];

    const item = {
      id: Date.now(),
      name: selectedProduct.name,
      image: selectedProduct.image,
      weight: selectedWeight,
      price: price,
      quantity: 1,
    };

    setCart((currentCart) => [
      ...currentCart,
      item,
    ]);

    setPage("cart");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =======================================================
     UPDATE QUANTITY
     ======================================================= */

  const updateQuantity = (id, change) => {

    setCart((currentCart) =>

      currentCart.map((item) => {

        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            1,
            item.quantity + change
          ),
        };

      })
    );
  };


  /* =======================================================
     REMOVE ITEM
     ======================================================= */

  const removeItem = (id) => {

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };


  /* =======================================================
     PLACE ORDER
     ======================================================= */
const placeOrder = async () => {
  const allDetailsFilled = Object.values(customerDetails).every(
    (value) => value.trim() !== ""
  );

  if (!allDetailsFilled) {
    alert("Please fill all customer details.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    setPage("products");
    scrollTop();
    return;
  }

  const newOrderId = "MW-" + Date.now();
  const itemsForOrder = [...cart];

  const orderData = {
    orderId: newOrderId,
    customer: customerDetails,
    paymentMethod: paymentMethod,
    items: itemsForOrder,
    total: cartTotal,
  };

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    console.log("Order sent to Backend:", data);

    setOrderId(newOrderId);
    setOrderItems(itemsForOrder);
    setLastOrderTotal(cartTotal);
    setCart([]);
    setPage("confirm");
  } catch (error) {
    console.error("Order Backend Error:", error);
    alert("Order could not be sent to backend.");
  }
};

  /* =======================================================
     NAVBAR
     ======================================================= */

  const Navbar = () => {

    return (

      <nav className="navbar">

        {/* BRAND / LOGO */}

        <button
          className="brand"
          onClick={goHome}
          aria-label="Mangodi Wale Home"
        >

          <div className="brand-logo-wrap">

            <img
              src="/images/logo.png"
              alt="Mangodi Wale Logo"
            />

            {/* HOVER POPUP */}

            <span className="logo-hover-popup">
              MANGODI WALE
              <small>
                Ghar Ka Swaad
              </small>
            </span>

          </div>


          <span className="brand-name">
            MANGODI WALE
          </span>


          <small className="brand-subtitle">
            GHAR KA SWAAD
          </small>

        </button>


        {/* NAV LINKS */}

        <div className="nav-links">

          <button
            className={
              page === "home"
                ? "active"
                : ""
            }
            onClick={goHome}
          >
            Home
          </button>


          <button
            className={
              page === "products"
                ? "active"
                : ""
            }
            onClick={goProducts}
          >
            Products
          </button>


          <button
            className={
              page === "about"
                ? "active"
                : ""
            }
            onClick={() =>
              goTo("about")
            }
          >
            About
          </button>


          <button
            className={
              page === "contact"
                ? "active"
                : ""
            }
            onClick={() =>
              goTo("contact")
            }
          >
            Contact
          </button>

        </div>


        {/* NAV ACTIONS */}

        <div className="nav-actions">

          <button
            className="cart-link"
            onClick={() =>
              goTo("cart")
            }
          >
            🛒 Cart ({cart.length})
          </button>


          <button
            className="order-now"
            onClick={goProducts}
          >
            Order Now →
          </button>

        </div>

      </nav>
    );
  };


  /* =======================================================
     FOOTER
     ======================================================= */

  const Footer = () => {

    return (

      <footer>

        <div className="footer-main">

          <div className="footer-brand">

            <img
              src="/images/logo.png"
              alt="Mangodi Wale"
            />

            <div>

              <strong>
                MANGODI WALE
              </strong>

              <span>
                Ghar ka swaad, seedha aapke ghar.
              </span>

            </div>

          </div>


          <div className="footer-links">

            <button onClick={goHome}>
              Home
            </button>

            <button onClick={goProducts}>
              Products
            </button>

            <button
              onClick={() =>
                goTo("about")
              }
            >
              About
            </button>

            <button
              onClick={() =>
                goTo("contact")
              }
            >
              Contact
            </button>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Mangodi Wale
          </span>

          <span>
            Traditional • Fresh • Desi
          </span>

        </div>

      </footer>
    );
  };


  /* =======================================================
     HOME PAGE
     ======================================================= */

  const HomePage = () => {

    return (

      <>

        {/* =================================================
            HERO
            ================================================= */}

        <section className="hero">


          {/* LEFT CONTENT */}

          <div className="hero-copy">

            <div className="hero-kicker">

              <span>❧</span>

              TRADITIONAL

              <i>•</i>

              FRESH

              <i>•</i>

              DESI

            </div>


            <h1>

              Ghar ka swaad,

              <span>
                seedha aapke ghar.
              </span>

            </h1>


            <p className="hero-description">

              Rajasthani-inspired snacks
              made with traditional taste,
              authentic recipes and lots
              of love.

            </p>


            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={goProducts}
              >

                Explore Products

                <span>
                  →
                </span>

              </button>


              <button
                className="gold-btn"
                onClick={() =>
                  goTo("about")
                }
              >

                Our Story

                <span>
                  ✦
                </span>

              </button>

            </div>


            {/* HERO FEATURES */}

            <div className="hero-features">

              <div className="hero-feature">

                <div className="feature-icon">
                  ❧
                </div>

                <div>

                  <strong>
                    Traditional
                  </strong>

                  <span>
                    Taste
                  </span>

                </div>

              </div>


              <div className="feature-line"></div>


              <div className="hero-feature">

                <div className="feature-icon">
                  ♧
                </div>

                <div>

                  <strong>
                    Fresh
                  </strong>

                  <span>
                    Products
                  </span>

                </div>

              </div>


              <div className="feature-line"></div>


              <div className="hero-feature">

                <div className="feature-icon">
                  ◈
                </div>

                <div>

                  <strong>
                    Easy
                  </strong>

                  <span>
                    Ordering
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE — MANGODI MAKING VIDEO
              ================================================= */}

          <div className="hero-visual">

            <video
              className="hero-main-video"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/mangodi.jpg"
            >

              <source
                src="/videos/mangodi-making.mp4"
                type="video/mp4"
              />

              Your browser does not support
              the video tag.

            </video>


            {/* SOFT IMAGE/VIDEO OVERLAY */}

            <div className="hero-image-overlay"></div>


            {/* RAJASTHANI TEXT */}

            <div className="hero-script">

              Rajasthani

              <span>
                Parampara ♡
              </span>

            </div>


            {/* HOMEMADE BADGE */}

            <div className="homemade-badge">

              <span>
                ❧
              </span>

              <strong>
                100%
              </strong>

              <small>
                HOMEMADE
              </small>

            </div>


            {/* VIDEO LABEL */}

            <div className="hero-image-label">

              <span>
                TRADITIONAL PREPARATION
              </span>

              <strong>
                MANGODI
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            PRODUCTS
            ================================================= */}

        <section className="products-preview">

          <div className="section-heading">

            <span>
              ❧
            </span>

            <div>

              <small>
                FROM OUR KITCHEN
              </small>

              <h2>
                Our Products
              </h2>

            </div>

            <span>
              ❧
            </span>

          </div>

<ProductCards products={displayProducts} onOpen={openProduct} />

          <div className="view-all-wrap">

            <button
              className="outline-btn"
              onClick={goProducts}
            >
              View All Products →
            </button>

          </div>

        </section>


        {/* =================================================
            WHY CHOOSE
            ================================================= */}

        <section className="why-section">

          <div className="section-heading light">

            <span>
              ❧
            </span>

            <div>

              <small>
                THE MANGODI WALE PROMISE
              </small>

              <h2>
                Made the traditional way.
              </h2>

            </div>

            <span>
              ❧
            </span>

          </div>


          <div className="why-grid">

            <div className="why-card">

              <div className="why-icon">
                🌿
              </div>

              <h3>
                Quality Products
              </h3>

              <p>
                Made with care and
                attention to every batch.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                🏠
              </div>

              <h3>
                Ghar Jaisa Taste
              </h3>

              <p>
                Traditional flavours
                that feel familiar.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                📦
              </div>

              <h3>
                Flexible Packs
              </h3>

              <p>
                Choose the pack size
                that suits you.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                🚚
              </div>

              <h3>
                Easy Ordering
              </h3>

              <p>
                Simple ordering from
                your home.
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            STATS
            ================================================= */}

        <section className="stats-section">

          <div className="stat">

            <strong>
              03
            </strong>

            <span>
              Signature Products
            </span>

          </div>


          <div className="stat">

            <strong>
              250g+
            </strong>

            <span>
              Flexible Packs
            </span>

          </div>


          <div className="stat">

            <strong>
              100%
            </strong>

            <span>
              Easy Ordering
            </span>

          </div>

        </section>

      </>
    );
  };


  /* =======================================================
     PRODUCTS PAGE
     ======================================================= */

  const ProductsPage = () => {

    return (

      <main className="inner-page">

        <div className="page-title">

          <span>
            TRADITIONAL • FRESH • DESI
          </span>

          <h1>
            Our Products
          </h1>

          <p>
            Choose your favourite
            ghar ka swaad.
          </p>

        </div>


        <ProductCards
          products={products}
          onOpen={openProduct}
        />

      </main>
    );
  };


  /* =======================================================
     PRODUCT DETAIL
     ======================================================= */

  const ProductDetailPage = () => {

    if (!selectedProduct) {
      return null;
    }


    return (

      <main className="inner-page">

        <button
          className="back-btn"
          onClick={goProducts}
        >
          ← Back to Products
        </button>


        <section className="detail-page">

          <div className="detail-image">

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

          </div>


          <div className="detail-info">

            <span className="mini-tag">
              {selectedProduct.tag}
            </span>


            <h1>
              {selectedProduct.name}
            </h1>


            <p>
              {selectedProduct.description}
            </p>


            <h3>
              Choose Pack Size
            </h3>


            <div className="weights">

              {[
                "250g",
                "500g",
                "1kg",
              ].map((weight) => (

                <button
                  key={weight}
                  className={
                    selectedWeight === weight
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSelectedWeight(
                      weight
                    )
                  }
                >

                  <strong>
                    {weight}
                  </strong>

                  <small>
                    ₹
                    {
                      selectedProduct
                        .prices[weight]
                    }
                  </small>

                </button>

              ))}

            </div>


            <div className="detail-price">

              ₹
              {
                selectedProduct
                  .prices[selectedWeight]
              }

            </div>


            <div className="detail-actions">

              <button
                className="primary-btn large"
                onClick={addToCart}
              >
                Add to Cart →
              </button>


              <button
                className="text-btn"
                onClick={() =>
                  goTo("cart")
                }
              >
                View Cart
              </button>

            </div>

          </div>

        </section>

      </main>
    );
  };


  /* =======================================================
     CART PAGE
     ======================================================= */

  const CartPage = () => {

    return (

      <main className="inner-page">

        <div className="page-title">

          <span>
            YOUR SELECTION
          </span>

          <h1>
            Your Cart
          </h1>

        </div>


        {cart.length === 0 ? (

          <div className="empty-box">

            <div className="empty-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Add some Mangodi Wale
              favourites to continue.
            </p>

            <button
              className="primary-btn"
              onClick={goProducts}
            >
              Explore Products →
            </button>

          </div>

        ) : (

          <section className="cart-layout">

            <div className="cart-items">

              {cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />


                  <div className="cart-item-info">

                    <span>
                      {item.weight}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹{item.price}
                    </p>


                    <div className="quantity">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <strong>
                        {item.quantity}
                      </strong>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  <div className="cart-item-right">

                    <strong>
                      ₹
                      {
                        item.price *
                        item.quantity
                      }
                    </strong>


                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>


            <aside className="summary-card">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                ₹{cartTotal}
              </h2>

              <p>
                Delivery details will
                be collected at checkout.
              </p>


              <button
                className="primary-btn full"
                onClick={() =>
                  goTo("checkout")
                }
              >
                Proceed to Checkout →
              </button>


              <button
                className="text-btn"
                onClick={goProducts}
              >
                Continue Shopping
              </button>

            </aside>

          </section>

        )}

      </main>
    );
  };


  /* =======================================================
     CHECKOUT PAGE
     ======================================================= */

  const renderCheckoutPage = () => {

    return (

      <main className="inner-page">

        <div className="page-title">

          <span>
            ALMOST THERE
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Enter your delivery details.
          </p>

        </div>


        <section className="checkout-layout">

          <div className="checkout-form">

            <h2>
              Customer Details
            </h2>


            <div className="form-grid">

              <input
                type="text"
                placeholder="Full Name"
                value={
                  customerDetails.name
                }
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    name:
                      e.target.value,
                  })
                }
              />


              <input
                type="tel"
                placeholder="Mobile Number"
                 maxLength={10}
                value={
                  customerDetails.mobile
                }
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    mobile:
                      e.target.value,
                  })
                }
              />


              <input
                className="wide"
                type="text"
                placeholder="House / Street Address"
                value={
                  customerDetails.address
                }
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    address:
                      e.target.value,
                  })
                }
              />


              <input
                type="text"
                placeholder="City"
                value={
                  customerDetails.city
                }
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    city:
                      e.target.value,
                  })
                }
              />


              <input
                type="text"
                placeholder="State"
                value={
                  customerDetails.state
                }
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    state:
                      e.target.value,
                  })
                }
              />


              <input
                type="tel"
                placeholder="Pincode"
                maxLength={6}
                value={
                  customerDetails.pincode
                }
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    pincode:
                      e.target.value,
                  })
                }
              />

            </div>


            <h2>
              Payment Method
            </h2>


            <label className="payment-option">

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "Online Payment"
                }
                onChange={() =>
                  setPaymentMethod(
                    "Online Payment"
                  )
                }
              />

              Online Payment

            </label>


            <label className="payment-option">

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "Cash on Delivery"
                }
                onChange={() =>
                  setPaymentMethod(
                    "Cash on Delivery"
                  )
                }
              />

              Cash on Delivery

            </label>

          </div>


          <aside className="summary-card">

            <span>
              TOTAL AMOUNT
            </span>

            <h2>
              ₹{cartTotal}
            </h2>


            <div className="checkout-list">

              {cart.map((item) => (

                <p key={item.id}>

                  {item.name}

                  {" — "}

                  {item.weight}

                  {" × "}

                  {item.quantity}

                </p>

              ))}

            </div>


            <button
              className="primary-btn full"
              onClick={placeOrder}
            >
              Place Order →
            </button>

          </aside>

        </section>

      </main>
    );
  };


  /* =======================================================
     CONFIRMATION PAGE
     ======================================================= */

  const ConfirmationPage = () => {

    return (

      <main className="inner-page">

        <section className="success-page">

          <div className="success-mark">
            ✓
          </div>


          <span>
            Thank you for ordering
            from Mangodi Wale.
          </span>


          <h1>
            Order Placed!
          </h1>


          <div className="order-id">

            Order ID:

            <strong>
              {orderId}
            </strong>

          </div>


          <div className="confirmation-grid">

            <div>

              <span>
                CUSTOMER
              </span>

              <strong>
                {customerDetails.name}
              </strong>

            </div>


            <div>

              <span>
                MOBILE
              </span>

              <strong>
                {customerDetails.mobile}
              </strong>

            </div>


            <div>

              <span>
                PAYMENT
              </span>

              <strong>
                {paymentMethod}
              </strong>

            </div>


            <div>

              <span>
                DELIVERY ADDRESS
              </span>

              <strong>
                {customerDetails.address},
                {" "}
                {customerDetails.city},
                {" "}
                {customerDetails.state}
                {" - "}
                {customerDetails.pincode}
              </strong>

            </div>

          </div>


          <div className="confirmation-summary">

            <h2>
              Order Summary
            </h2>


            {orderItems.map(
              (item) => (

                <p key={item.id}>

                  {item.name}

                  {" — "}

                  {item.weight}

                  {" × "}

                  {item.quantity}

                  {" = ₹"}

                  {
                    item.price *
                    item.quantity
                  }

                </p>

              )
            )}


            <h3>

              Total Amount:

              {" ₹"}

              {lastOrderTotal}

            </h3>

          </div>


          <button
            className="primary-btn"
            onClick={goHome}
          >
            Back to Home →
          </button>

        </section>

      </main>
    );
  };


  /* =======================================================
     ABOUT PAGE
     ======================================================= */

  const AboutPage = () => {

    return (

      <main className="inner-page simple-page">

        <div className="page-title">

          <span>
            OUR STORY
          </span>

          <h1>
            Ghar Ka Swaad
          </h1>

          <p>
            A taste rooted in tradition.
          </p>

        </div>


        <section className="story-card">

          <div className="story-decoration">
            ❧
          </div>

          <h2>
            Traditional taste,
            made with love.
          </h2>


          <p>
            Mangodi Wale brings the
            familiar taste of traditional
            Rajasthani snacks straight
            to your home.
          </p>


          <p>
            From Mangodi to Banana Chips
            and Namkeen, every product
            carries the warmth of
            ghar ka swaad.
          </p>

        </section>

      </main>
    );
  };


  /* =======================================================
     CONTACT PAGE
     ======================================================= */

  const ContactPage = () => {

    return (

      <main className="inner-page simple-page">

        <div className="page-title">

          <span>
            GET IN TOUCH
          </span>

          <h1>
            Contact Us
          </h1>

          <p>
            We would love to hear from you.
          </p>

        </div>


        <section className="contact-card">

          <div className="story-decoration">
            ❧
          </div>

          <h2>
            Mangodi Wale
          </h2>


          <p>
            For product enquiries,
            orders and business
            information, contact us.
          </p>


          <div className="contact-details">

            <p>

              <strong>
                Phone
              </strong>

              <span>
                Add your business number
              </span>

            </p>


            <p>

              <strong>
                Email
              </strong>

              <span>
                Add your business email
              </span>

            </p>


            <p>

              <strong>
                Address
              </strong>

              <span>
                Add your business address
              </span>

            </p>

          </div>

        </section>

      </main>
    );
  };


  /* =======================================================
     PAGE ROUTER
     ======================================================= */

  const renderPage = () => {

    switch (page) {

      case "home":
        return <HomePage />;

      case "products":
        return <ProductsPage />;

      case "detail":
        return <ProductDetailPage />;

      case "cart":
        return <CartPage />;

      case "checkout":
       return renderCheckoutPage();

      case "confirm":
        return <ConfirmationPage />;

      case "about":
        return <AboutPage />;

      case "contact":
        return <ContactPage />;

      default:
        return <HomePage />;
    }
  };


  /* =======================================================
     APP
     ======================================================= */

  return (

    <div className="app">

      <Navbar />

      {renderPage()}

      <Footer />

    </div>

  );
}


/* =========================================================
   PRODUCT CARDS
   ========================================================= */

function ProductCards({
  products,
  onOpen,
}) {

  return (

    <div className="product-grid">

      {products.map((product) => (

        <article
          className="product-card"
          key={product.id}
        >

          <div className="product-photo">

            <img
              src={product.image}
              alt={product.name}
            />

            <span>
              {product.tag}
            </span>

          </div>


          <div className="product-body">

            <span className="product-category">
              TRADITIONAL SNACK
            </span>

            <h3>
              {product.name}
            </h3>


            <p>
              {product.description}
            </p>


            <div className="product-bottom">

              <span>
                From ₹
                {
                  product.prices["250g"]
                }
              </span>


              <button
                onClick={() =>
                  onOpen(product)
                }
              >
                View Product →
              </button>

            </div>

          </div>

        </article>

      ))}

    </div>

  );
}


export default App;