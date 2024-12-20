from flask import Blueprint, render_template, request, jsonify
from app.models import db, Product

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/')
def admin_index():
    print("admin index")
    return render_template('admin/index.html', title="Admin Dashboard")


@admin_bp.route('/menu')
def admin_menu():
    menu_items = [
        {"id": 1, "name": "Burger", "price": 8.99},
        {"id": 2, "name": "Pizza", "price": 12.99},
    ]
    return render_template('admin/menu.html', title="Admin Menu", menu_items=menu_items)


# @admin_bp.route('/product')
# def admin_menu():
#     menu_items = [
#         {"id": 1, "name": "Burger", "price": 8.99},
#         {"id": 2, "name": "Pizza", "price": 12.99},
#     ]
#     return render_template('menu.html', title="Admin Menu", menu_items=menu_items)


# @admin_bp.route('/stat')
# def admin_menu():
#     menu_items = [
#         {"id": 1, "name": "Burger", "price": 8.99},
#         {"id": 2, "name": "Pizza", "price": 12.99},
#     ]
#     return render_template('menu.html', title="Admin Menu", menu_items=menu_items)


@admin_bp.route('/add_menu', methods=['POST'])
def add_menu():
    # Parse the JSON data sent by the fetch request
    data = request.get_json()

    # Extract 'name' and 'price' from the parsed JSON
    product_name = data.get('name')
    product_price = data.get('price')
    product_available = data.get('available', True)

    new_product = Product(
        name=product_name, price=product_price, available=product_available)
    db.session.add(new_product)
    db.session.commit()

    # Return a JSON response
    return jsonify({'status': 'success', 'name': product_name, 'price': product_price})
