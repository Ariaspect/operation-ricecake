from flask import Flask


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    from app.models import db
    db.init_app(app)
    with app.app_context():  # init db
        db.create_all()

    from app.routes import main_bp, admin_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp)

    return app
