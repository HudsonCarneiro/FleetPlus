const pool = require('../config/database');

const Vehicle = {
    async getAll(userId) {
        const [rows] = await pool.query('SELECT * FROM vehicles WHERE userId = ?', [userId]);
        return rows;
    },

    async getById(id, userId) {
        const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ? AND userId = ?', [id, userId]);
        return rows[0] || null;
    },

    async create(vehicleData) {
        const { plate, model, automaker, year, fuelType, mileage, userId } = vehicleData;
        const [result] = await pool.query(
            'INSERT INTO vehicles (plate, model, automaker, year, fuelType, mileage, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [plate, model, automaker, year, fuelType, mileage, userId]
        );
        return { id: result.insertId, ...vehicleData };
    },

    async update(id, userId, updateData) {
        const [result] = await pool.query('UPDATE vehicles SET ? WHERE id = ? AND userId = ?', [updateData, id, userId]);
        return result.affectedRows > 0;
    },

    async delete(id, userId) {
        const [result] = await pool.query('DELETE FROM vehicles WHERE id = ? AND userId = ?', [id, userId]);
        return result.affectedRows > 0;
    },

    async updateMileage(vehicleId, userId, mileage) {
        const [result] = await pool.query(
            'UPDATE vehicles SET mileage = ? WHERE id = ? AND userId = ? AND mileage < ?',
            [mileage, vehicleId, userId, mileage]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Vehicle;
