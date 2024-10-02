import { useState, useEffect } from "react";
import Layout from "../Layout";
import Card from "./Card";
import { prices } from "../../utils/prices";
import { showError, showSuccess } from "../../utils/messages";
import {
  getCategories,
  getProducts,
  getFilteredProducts,
} from "../../api/apiProduct";
import { addToCart } from "../../api/apiOrder";
import { isAuthenticated, userInfo } from "../../utils/auth";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState(30);
  const [skip, setSkip] = useState(0);
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
  });
  const [priceRange, setPriceRange] = useState({
    lower: "",
    upper: "",
  });

  useEffect(() => {
    getProducts(sortBy, order, limit)
      .then((response) => setProducts(response.data))
      .catch((err) => setError("Failed to load products!"));

    getCategories()
      .then((response) => setCategories(response.data))
      .catch((err) => setError("Failed to load categories!"));
  }, []);

  const handleAddToCart = (product) => () => {
    if (isAuthenticated()) {
      setError(false);
      setSuccess(false);
      const user = userInfo();
      const cartItem = {
        user: user._id,
        product: product._id,
        price: product.price,
      };
      addToCart(user.token, cartItem)
        .then((response) => setSuccess(true))
        .catch((err) => {
          if (err.response) setError(err.response.data);
          else setError("Adding to cart failed!");
        });
    } else {
      setSuccess(false);
      setError("Please Login First!");
    }
  };

  const handleFilters = (myfilters, filterBy) => {
    const newFilters = { ...filters };
    if (filterBy === "category") {
      newFilters[filterBy] = [myfilters];
    }
    if (filterBy === "price") {
      newFilters[filterBy] = myfilters;
    }

    setFilters(newFilters);
    getFilteredProducts(skip, limit, newFilters, order, sortBy)
      .then((response) => setProducts(response.data))
      .catch((err) => setError("Failed to load products!"));
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange({
      ...priceRange,
      [e.target.name]: e.target.value,
    });
  };

  const handlePriceFilter = () => {
    const { lower, upper } = priceRange;
    if (lower !== "" && upper !== "") {
      handleFilters([parseInt(lower), parseInt(upper)], "price");
    } else {
      setError("Please enter both lower and upper price ranges.");
    }
  };

  const showFilters = () => {
    return (
      <>
        <div className="row my-4">
          <div className="col-sm-3">
            <h5>Filter By Categories:</h5>
            <select
              className="form-control"
              onChange={(e) => handleFilters(e.target.value, "category")}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-5">
            <h5>Filter By Price:</h5>
            <div className="row align-items-center">
              {" "}
              {/* Added align-items-center for vertical alignment */}
              <div className="col-sm-4">
                <input
                  type="number"
                  name="lower"
                  value={priceRange.lower}
                  onChange={handlePriceRangeChange}
                  placeholder="Lower Price"
                  className="form-control"
                />
              </div>
              <div className="col-sm-4">
                <input
                  type="number"
                  name="upper"
                  value={priceRange.upper}
                  onChange={handlePriceRangeChange}
                  placeholder="Upper Price"
                  className="form-control"
                />
              </div>
              <div className="col-sm-4">
                <button
                  onClick={handlePriceFilter}
                  className="btn btn-primary btn-block" // btn-block for full width
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout title="Home Page" className="container-fluid">
      {showFilters()}
      <div style={{ width: "100%" }}>
        {showError(error, error)}
        {showSuccess(success, "Added to cart successfully!")}
      </div>
      <div className="row">
        {products &&
          products.map((product) => (
            <Card
              product={product}
              key={product._id}
              handleAddToCart={handleAddToCart(product)}
            />
          ))}
      </div>
    </Layout>
  );
};

export default Home;
