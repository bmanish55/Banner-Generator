import db from './database.js';

class Banner {
  static create(userId, title, requirements, designData, imagePath = null) {
    const stmt = db.prepare(
      'INSERT INTO banners (user_id, title, requirements, design_data, image_path) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(userId, title, requirements, JSON.stringify(designData), imagePath);
    return result.lastInsertRowid;
  }

  static findByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM banners WHERE user_id = ? ORDER BY created_at DESC');
    const banners = stmt.all(userId);
    return banners.map(banner => ({
      ...banner,
      design_data: JSON.parse(banner.design_data)
    }));
  }

  static findById(id, userId) {
    const stmt = db.prepare('SELECT * FROM banners WHERE id = ? AND user_id = ?');
    const banner = stmt.get(id, userId);
    if (banner) {
      banner.design_data = JSON.parse(banner.design_data);
    }
    return banner;
  }

  static update(id, userId, updates) {
    const { title, requirements, designData, imagePath } = updates;
    let query = 'UPDATE banners SET ';
    const params = [];
    const fields = [];

    if (title !== undefined) {
      fields.push('title = ?');
      params.push(title);
    }
    if (requirements !== undefined) {
      fields.push('requirements = ?');
      params.push(requirements);
    }
    if (designData !== undefined) {
      fields.push('design_data = ?');
      params.push(JSON.stringify(designData));
    }
    if (imagePath !== undefined) {
      fields.push('image_path = ?');
      params.push(imagePath);
    }

    query += fields.join(', ') + ' WHERE id = ? AND user_id = ?';
    params.push(id, userId);

    const stmt = db.prepare(query);
    return stmt.run(...params);
  }

  static delete(id, userId) {
    const stmt = db.prepare('DELETE FROM banners WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
  }
}

export default Banner;
