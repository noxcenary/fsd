import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

export default function AddResourceModal({ isOpen, onClose, onResourceAdded }) {
  const categories = [
    'Food & Nutrition',
    'Medicines & First Aid',
    'Medical Equipment',
    'Clothing & Blankets',
    'Shelter Materials',
    'Water & Sanitation',
    'Education Supplies'
  ];

  const units = ['kg', 'units', 'kits', 'boxes', 'sets', 'pairs', 'sheets', 'litres'];
  const conditions = ['New / Factory Sealed', 'Medical Grade', 'Dry Vacuum Sealed', 'New Packaged', 'Gently Used / Tested'];

  const [formData, setFormData] = useState({
    name: '',
    category: 'Food & Nutrition',
    quantity: '',
    unit: 'kg',
    depot: 'Central Coordination Warehouse',
    condition: 'New / Factory Sealed',
    expiryDate: '',
    weightKg: '',
    transportRequired: 'Standard Delivery Vehicle',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quantity) return;

    onResourceAdded({
      ...formData,
      quantity: Number(formData.quantity)
    });

    onClose();
    setFormData({
      name: '',
      category: 'Food & Nutrition',
      quantity: '',
      unit: 'kg',
      depot: 'Central Coordination Warehouse',
      condition: 'New / Factory Sealed',
      expiryDate: '',
      weightKg: '',
      transportRequired: 'Standard Delivery Vehicle',
      notes: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="List Available Surplus Resource" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-[12px] text-brand-walnut/70">
          Declare surplus or unused essential resources available for sharing with NGOs experiencing shortages.
        </p>

        <Input
          label="Resource Name & Description"
          name="name"
          placeholder="e.g. High-Protein Dry Ration Packs (25kg Sacks)"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Resource Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="500"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <Select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              options={units}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Storage Location / District"
            name="depot"
            placeholder="e.g. Madurai Central Storage"
            value={formData.depot}
            onChange={handleChange}
            required
          />
          <Select
            label="Condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            options={conditions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Expiry Date (if applicable)"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
          />
          <Input
            label="Estimated Weight (kg)"
            name="weightKg"
            type="number"
            placeholder="e.g. 500"
            value={formData.weightKg}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-[13px] font-semibold text-brand-walnut">
            Handling, Transport & Storage Notes
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Dry storage required. Ready for immediate handover or vehicle pickup."
            className="w-full bg-white text-brand-walnut text-[13px] border border-brand-border rounded-lg p-2.5 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 transition-colors"
          ></textarea>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-brand-border">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" icon="add_circle">
            Publish Surplus to Network
          </Button>
        </div>
      </form>
    </Modal>
  );
}
