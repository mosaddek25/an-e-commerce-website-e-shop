import React, { useEffect } from "react";
import { API } from "../../utils/config";
import { getProductDetails } from "../../api/apiProduct";

const CartItem = ({
	item,
	serial,
	increaseItem,
	decreaseItem,
	removeItem,
	itemQuantity,
}) => {
	useEffect(() => {
		getProductDetails(item.product._id)
			.then((response) => {
				itemQuantity({
					id: item.product._id,
					quantity: response.data.quantity,
				});
			})
			.catch((err) => console.log("Failed to load products"));
	}, []);

	return (
		<tr>
			<th scope="row">{serial}</th>
			<th>
				<img
					src={`${API}/product/photo/${item.product._id}`}
					alt={item.product.name}
					width="30px"
				/>
			</th>
			<td>{item.product ? item.product.name : ""}</td>
			<td>
				<button
					className="btn btn-outline-primary btn-sm"
					onClick={decreaseItem}
				>
					-
				</button>
				&nbsp;&nbsp;{item.count}&nbsp;&nbsp;
				<button
					className="btn btn-outline-primary btn-sm"
					onClick={increaseItem}
				>
					+
				</button>
			</td>
			<td align="right">৳ {item.price * item.count} </td>
			<td>
				<button className="btn btn-danger btn-sm" onClick={removeItem}>
					Remove From Cart
				</button>
			</td>
		</tr>
	);
};

export default CartItem;
