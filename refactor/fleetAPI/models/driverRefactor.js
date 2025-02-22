const pool = require('../config/database');

const Driver = {
    async getAll(companyId) {
        const [rows] = await pool.query('SELECT * FROM drivers WHERE companyId = ?', [companyId]);
        return rows;
    },

    async getById(id, companyId) {
        const [rows] = await pool.query('SELECT * FROM drivers WHERE id = ? AND companyId = ?', [id, companyId]);
        return rows[0] || null;
    },

    async create(driverData) {
        const { cnh, phone, companyId } = driverData;
        const [result] = await pool.query(
            'INSERT INTO drivers (plate, model, automaker, year, fuelType, mileage, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
