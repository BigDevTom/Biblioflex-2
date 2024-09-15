const db = require('../config/db');

// Fonction pour créer un utilisateur
exports.create = (name, first_name, email, password, role, callback) => {
  const query = 'INSERT INTO users (name, first_name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
  db.query(query, [name, first_name, email, password, role], (err, result) => {
    callback(err, result);
  });
};

exports.findByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null); // Pas d'utilisateur trouvé
      }
      return callback(null, results[0]); // Retourner le premier utilisateur trouvé
    });
  };
