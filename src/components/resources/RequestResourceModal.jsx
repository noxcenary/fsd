import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

export default function RequestResourceModal({ isOpen, onClose, onRequestCreated, prefillData = null }) {
  const [formData, setFormData] = useState({
    title: prefillData ? prefillData.name : '',
    subtitle: prefillData ? `Requested from ${prefillData.owner}` : '',
    quantity: prefillData ? prefillData.quantity : '',
    unit: prefillData ? prefillData.unit : 'units',
    urgency: 'Emergency',
    location: 'Madurai District Field Relief Centre',
    requiredByDate: 'Within 48 hours',
    beneficiaryCount: '350 families',
    notes: ''
  });

  const urgencies = ['Emergency', 'High', 'Normal'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.quantity) return;

    onRequestCreated({
      title: formData.title,
      subtitle: formData.subtitle || `${formData.beneficiaryCount} • Needed ${formData.requiredByDate}`,
      quantity: `${formData.quantity} ${formData.unit}`,
      urgency: formData.urgency,
      location: formData.location,
      notes: formData.notes
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Resource Request" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-[12px] text-brand-walnut/70">
          Submit your NGO's resource shortage. The AI-assisted matching engine will recommend suitable surplus providers based on proximity, quantity, and urgency.
        </p>

        <Input
          label="Resource Needed"
          name="title"
          placeholder="e.g. Drinking Water Filtration Kits or Trauma First Aid Supplies"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="300"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <Input
              label="Unit"
              name="unit"
              placeholder="kits / kg"
              value={formData.unit}
              onChange={handleChange}
            />
          </div>

          <Select
            label="Urgency Level"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            options={urgencies}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Delivery Location / District"
            name="location"
            placeholder="e.g. Wayanad Relief Camp or Theni Field Centre"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <Input
            label="Required By Timeline"
            name="requiredByDate"
            placeholder="e.g. Within 24-48 hours"
            value={formData.requiredByDate}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Target Beneficiary Count"
            name="beneficiaryCount"
            placeholder="e.g. 250 families"
            value={formData.beneficiaryCount}
            onChange={handleChange}
          />
          <Input
            label="Intended Purpose"
            name="subtitle"
            placeholder="e.g. Disaster relief for flood-affected families"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-[13px] font-semibold text-brand-walnut">
            Additional Requirements &amp; Restrictions
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Transport assistance needed. Direct unloading site accessible by light vehicle."
            className="w-full bg-white text-brand-walnut text-[13px] border border-brand-border rounded-lg p-2.5 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 transition-colors"
          ></textarea>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-brand-border">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" size="md" type="submit" icon="post_add">
            Publish Resource Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
