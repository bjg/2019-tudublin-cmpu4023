select purchases.name, purchases.address, 
	users.email, purchase_items.quantity, 
	purchase_items.price, purchase_items.state 
from purchases 
join users on purchases.user_id = users.id 
join purchase_items on purchases.id = purchase_items.purchase_id 
where purchases.name = $1;